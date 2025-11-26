#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { extractAuthContext } from './auth/auth-context.js';
import { ClerkAuthService } from './auth/clerk-auth.js';
import { ConfluenceTools } from './tools/confluence-tools.js';
import { JiraTools } from './tools/jira-tools.js';
import { WorkspaceManager } from './workspace-manager.js';

const server = new Server(
  {
    name: 'trilix-atlassian-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Initialize with Clerk if available
const useClerk = !!process.env.CLERK_SECRET_KEY;
const workspaceManager = new WorkspaceManager(useClerk);
const clerkAuth = useClerk ? new ClerkAuthService() : undefined;
const confluenceTools = new ConfluenceTools(workspaceManager);
const jiraTools = new JiraTools(workspaceManager);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const confluenceToolList = await confluenceTools.listTools();
  const jiraToolList = await jiraTools.listTools();
  
  return {
    tools: [...confluenceToolList, ...jiraToolList],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  
  // Extract authentication context
  const authContext = extractAuthContext(request);
  let userId: string | undefined;
  
  // Verify Clerk token if provided
  if (authContext.clerkToken && clerkAuth) {
    try {
      const userContext = await clerkAuth.verifyToken(authContext.clerkToken);
      userId = userContext.userId;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  } else if (authContext.userId) {
    userId = authContext.userId;
  }

  // Route to appropriate tool handler with user context
  if (name.startsWith('confluence_')) {
    return await confluenceTools.handleTool(name, args, userId);
  } else if (name.startsWith('jira_')) {
    return await jiraTools.handleTool(name, args, userId);
  } else if (name.startsWith('workspace_')) {
    return await handleWorkspaceTools(name, args, userId);
  } else {
    throw new Error(`Unknown tool: ${name}`);
  }
});

// Workspace management tools
async function handleWorkspaceTools(name: string, args: any, userId?: string) {
  // Require authentication for workspace management if Clerk is enabled
  if (clerkAuth && !userId) {
    throw new Error('Authentication required. Please provide clerkToken or userId in request metadata.');
  }

  switch (name) {
    case 'workspace_add':
      const { workspaceName, baseUrl, email, apiToken } = args;
      if (!workspaceName || !baseUrl || !email || !apiToken) {
        throw new Error('Missing required parameters: workspaceName, baseUrl, email, apiToken');
      }
      await workspaceManager.addWorkspace(workspaceName, baseUrl, email, apiToken, userId);
      return {
        content: [
          {
            type: 'text',
            text: `Workspace "${workspaceName}" added successfully${userId ? ' to your account' : ''}.`,
          },
        ],
      };

    case 'workspace_list':
      const workspaces = await workspaceManager.listWorkspaces(userId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workspaces, null, 2),
          },
        ],
      };

    case 'workspace_remove':
      const { workspaceName: removeName } = args;
      if (!removeName) {
        throw new Error('Missing required parameter: workspaceName');
      }
      await workspaceManager.removeWorkspace(removeName, userId);
      return {
        content: [
          {
            type: 'text',
            text: `Workspace "${removeName}" removed successfully.`,
          },
        ],
      };

    default:
      throw new Error(`Unknown workspace tool: ${name}`);
  }
}

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async (request: any) => {
  const authContext = extractAuthContext(request);
  let userId: string | undefined;
  
  if (authContext.clerkToken && clerkAuth) {
    try {
      const userContext = await clerkAuth.verifyToken(authContext.clerkToken);
      userId = userContext.userId;
    } catch {
      // Continue without auth for resource listing
    }
  } else if (authContext.userId) {
    userId = authContext.userId;
  }

  const workspaces = await workspaceManager.listWorkspaces(userId);
  return {
    resources: workspaces.map((ws) => ({
      uri: `workspace://${ws.name}`,
      name: ws.name,
      description: `Atlassian workspace: ${ws.baseUrl}`,
      mimeType: 'application/json',
    })),
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request: any) => {
  const uri = request.params.uri;
  const authContext = extractAuthContext(request);
  let userId: string | undefined;
  
  if (authContext.clerkToken && clerkAuth) {
    try {
      const userContext = await clerkAuth.verifyToken(authContext.clerkToken);
      userId = userContext.userId;
    } catch {
      // Continue without auth
    }
  } else if (authContext.userId) {
    userId = authContext.userId;
  }

  if (uri.startsWith('workspace://')) {
    const workspaceName = uri.replace('workspace://', '');
    const workspace = await workspaceManager.getWorkspace(workspaceName, userId);
    if (!workspace) {
      throw new Error(`Workspace "${workspaceName}" not found`);
    }
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              name: workspace.name,
              baseUrl: workspace.baseUrl,
              email: workspace.email,
              // Don't expose the API token
            },
            null,
            2
          ),
        },
      ],
    };
  }
  throw new Error(`Unknown resource: ${uri}`);
});

// Error handling
server.onerror = (error: unknown) => {
  console.error('[MCP Error]', error);
};

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start the server
async function main() {
  // Check for --stdio flag (for ChatGPT compatibility, though stdio is default)
  const args = process.argv.slice(2);
  if (args.length > 0 && args[0] !== '--stdio') {
    console.error('Usage: trilix-atlassian [--stdio]');
    console.error('The server uses stdio transport by default.');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Trilix Atlassian MCP server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

