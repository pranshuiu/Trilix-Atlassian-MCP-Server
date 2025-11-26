import { ConfluenceClient } from 'confluence.js';
import * as fs from 'fs/promises';
import { Version3Client } from 'jira.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ClerkAuthService } from './auth/clerk-auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface WorkspaceConfig {
  name: string;
  baseUrl: string;
  email: string;
  apiToken: string;
}

export interface WorkspaceClient {
  name: string;
  baseUrl: string;
  email: string;
  jira?: Version3Client;
  confluence?: ConfluenceClient;
}

export class WorkspaceManager {
  private workspaces: Map<string, WorkspaceClient> = new Map();
  private userWorkspaces: Map<string, Map<string, WorkspaceClient>> = new Map(); // userId -> workspaceName -> WorkspaceClient
  private configPath: string;
  private clerkAuth?: ClerkAuthService;

  constructor(useClerk: boolean = false) {
    if (useClerk) {
      try {
        this.clerkAuth = new ClerkAuthService();
      } catch (error: any) {
        console.warn('Clerk authentication not available:', error.message);
        console.warn('Falling back to file-based storage');
      }
    }
    
    const configDir = process.env.CONFIG_DIR || path.join(process.cwd(), '.config');
    this.configPath = path.join(configDir, 'workspaces.json');
    this.loadWorkspaces().catch((err) => {
      console.error('Failed to load workspaces:', err);
    });
  }

  private async ensureConfigDir() {
    const configDir = path.dirname(this.configPath);
    try {
      await fs.access(configDir);
    } catch {
      await fs.mkdir(configDir, { recursive: true });
    }
  }

  private async loadWorkspaces() {
    try {
      await this.ensureConfigDir();
      const data = await fs.readFile(this.configPath, 'utf-8');
      const configs: WorkspaceConfig[] = JSON.parse(data);
      
      for (const config of configs) {
        await this.createWorkspaceClient(config);
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('Error loading workspaces:', error);
      }
    }
  }

  private async saveWorkspaces() {
    await this.ensureConfigDir();
    const configs: WorkspaceConfig[] = Array.from(this.workspaces.values()).map((ws) => ({
      name: ws.name,
      baseUrl: ws.baseUrl,
      email: ws.email,
      apiToken: this.getApiToken(ws.name) || '',
    }));
    await fs.writeFile(this.configPath, JSON.stringify(configs, null, 2), 'utf-8');
  }

  private getApiToken(workspaceName: string): string | undefined {
    // In a real implementation, you'd want to securely store tokens
    // For now, we'll retrieve it from the workspace client
    const workspace = this.workspaces.get(workspaceName);
    if (!workspace) return undefined;
    
    // We need to store the token separately since it's not in the client
    // This is a simplified approach - in production, use secure storage
    return (workspace as any).apiToken;
  }

  private async createWorkspaceClient(config: WorkspaceConfig): Promise<WorkspaceClient> {
    const workspace: WorkspaceClient = {
      name: config.name,
      baseUrl: config.baseUrl,
      email: config.email,
    };

    // Initialize Jira client
    try {
      workspace.jira = new Version3Client({
        host: config.baseUrl,
        authentication: {
          basic: {
            email: config.email,
            apiToken: config.apiToken,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to initialize Jira client for ${config.name}:`, error);
    }

    // Initialize Confluence client
    try {
      const confluenceHost = config.baseUrl.replace('.atlassian.net', '.atlassian.net/wiki');
      workspace.confluence = new ConfluenceClient({
        host: confluenceHost,
        authentication: {
          basic: {
            email: config.email,
            apiToken: config.apiToken,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to initialize Confluence client for ${config.name}:`, error);
    }

    // Store API token for later use
    (workspace as any).apiToken = config.apiToken;

    return workspace;
  }

  async addWorkspace(name: string, baseUrl: string, email: string, apiToken: string, userId?: string) {
    const config: WorkspaceConfig = { name, baseUrl, email, apiToken };
    const workspace = await this.createWorkspaceClient(config);

    if (userId && this.clerkAuth) {
      // Store in Clerk user metadata
      await this.clerkAuth.saveUserWorkspace(userId, config);
      
      // Also cache in memory
      if (!this.userWorkspaces.has(userId)) {
        this.userWorkspaces.set(userId, new Map());
      }
      this.userWorkspaces.get(userId)!.set(name, workspace);
    } else {
      // Fallback to file-based storage
      if (this.workspaces.has(name)) {
        throw new Error(`Workspace "${name}" already exists`);
      }
      this.workspaces.set(name, workspace);
      await this.saveWorkspaces();
    }
  }

  async removeWorkspace(name: string, userId?: string) {
    if (userId && this.clerkAuth) {
      // Remove from Clerk user metadata
      await this.clerkAuth.removeUserWorkspace(userId, name);
      
      // Remove from memory cache
      const userMap = this.userWorkspaces.get(userId);
      if (userMap) {
        userMap.delete(name);
      }
    } else {
      // Fallback to file-based storage
      if (!this.workspaces.has(name)) {
        throw new Error(`Workspace "${name}" not found`);
      }
      this.workspaces.delete(name);
      await this.saveWorkspaces();
    }
  }

  async getWorkspace(name: string, userId?: string): Promise<WorkspaceClient | undefined> {
    if (userId && this.clerkAuth) {
      // Get from memory cache or load from Clerk
      const userMap = this.userWorkspaces.get(userId);
      if (userMap && userMap.has(name)) {
        return userMap.get(name);
      }
      
      // Load from Clerk metadata
      const workspaces = await this.clerkAuth.getUserWorkspaces(userId);
      const workspaceConfig = workspaces.find((w: any) => w.name === name);
      if (workspaceConfig) {
        const workspace = await this.createWorkspaceClient(workspaceConfig);
        if (!userMap) {
          this.userWorkspaces.set(userId, new Map());
        }
        this.userWorkspaces.get(userId)!.set(name, workspace);
        return workspace;
      }
      return undefined;
    } else {
      return this.workspaces.get(name);
    }
  }

  async listWorkspaces(userId?: string): Promise<Array<{ name: string; baseUrl: string; email: string }>> {
    if (userId && this.clerkAuth) {
      // Load from Clerk metadata
      const workspaces = await this.clerkAuth.getUserWorkspaces(userId);
      return workspaces.map((w: any) => ({
        name: w.name,
        baseUrl: w.baseUrl,
        email: w.email,
      }));
    } else {
      return Array.from(this.workspaces.values()).map((ws) => ({
        name: ws.name,
        baseUrl: ws.baseUrl,
        email: ws.email,
      }));
    }
  }

  async getJiraClient(workspaceName: string, userId?: string): Promise<Version3Client> {
    const workspace = await this.getWorkspace(workspaceName, userId);
    if (!workspace || !workspace.jira) {
      throw new Error(`Jira client not available for workspace "${workspaceName}"`);
    }
    return workspace.jira;
  }

  async getConfluenceClient(workspaceName: string, userId?: string): Promise<ConfluenceClient> {
    const workspace = await this.getWorkspace(workspaceName, userId);
    if (!workspace || !workspace.confluence) {
      throw new Error(`Confluence client not available for workspace "${workspaceName}"`);
    }
    return workspace.confluence;
  }
}

