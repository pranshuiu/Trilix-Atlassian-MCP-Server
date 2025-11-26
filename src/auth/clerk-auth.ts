import { createClerkClient, verifyToken } from '@clerk/backend';

export interface UserContext {
  userId: string;
  email?: string;
}

export class ClerkAuthService {
  private clerkClient: ReturnType<typeof createClerkClient>;
  private secretKey: string;

  constructor() {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }
    this.secretKey = secretKey;
    this.clerkClient = createClerkClient({ secretKey });
  }

  /**
   * Verify a Clerk session token and return user context
   */
  async verifyToken(token: string): Promise<UserContext> {
    try {
      // Verify the token
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
      });
      
      // Get user details
      const user = await this.clerkClient.users.getUser(payload.sub);
      
      return {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
      };
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Get user metadata (where we'll store Atlassian API keys)
   */
  async getUserMetadata(userId: string): Promise<Record<string, any>> {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      return (user.publicMetadata as Record<string, any>) || {};
    } catch (error: any) {
      throw new Error(`Failed to get user metadata: ${error.message}`);
    }
  }

  /**
   * Update user metadata (for storing Atlassian workspaces)
   */
  async updateUserMetadata(userId: string, metadata: Record<string, any>): Promise<void> {
    try {
      await this.clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: metadata,
      });
    } catch (error: any) {
      throw new Error(`Failed to update user metadata: ${error.message}`);
    }
  }

  /**
   * Get user's Atlassian workspaces from metadata
   */
  async getUserWorkspaces(userId: string): Promise<any[]> {
    const metadata = await this.getUserMetadata(userId);
    return metadata.atlassianWorkspaces || [];
  }

  /**
   * Save user's Atlassian workspace to metadata
   */
  async saveUserWorkspace(userId: string, workspace: any): Promise<void> {
    const metadata = await this.getUserMetadata(userId);
    const workspaces = metadata.atlassianWorkspaces || [];
    
    // Check if workspace with same name already exists
    const existingIndex = workspaces.findIndex((w: any) => w.name === workspace.name);
    if (existingIndex >= 0) {
      workspaces[existingIndex] = workspace;
    } else {
      workspaces.push(workspace);
    }

    await this.updateUserMetadata(userId, {
      ...metadata,
      atlassianWorkspaces: workspaces,
    });
  }

  /**
   * Remove user's Atlassian workspace from metadata
   */
  async removeUserWorkspace(userId: string, workspaceName: string): Promise<void> {
    const metadata = await this.getUserMetadata(userId);
    const workspaces = (metadata.atlassianWorkspaces || []).filter(
      (w: any) => w.name !== workspaceName
    );

    await this.updateUserMetadata(userId, {
      ...metadata,
      atlassianWorkspaces: workspaces,
    });
  }
}

