/**
 * Authentication context that can be passed through MCP requests
 * Since MCP uses stdio, we'll extract auth from request metadata or environment
 */
export interface AuthContext {
  userId?: string;
  clerkToken?: string;
  email?: string;
}

/**
 * Extract authentication context from MCP request
 * MCP requests can include metadata in the request params
 */
export function extractAuthContext(request: any): AuthContext {
  // Check for auth in request metadata
  const metadata = request.meta || request.params?.meta || {};
  
  return {
    userId: metadata.userId || process.env.MCP_USER_ID,
    clerkToken: metadata.clerkToken || process.env.MCP_CLERK_TOKEN,
    email: metadata.email || process.env.MCP_USER_EMAIL,
  };
}

/**
 * Validate that authentication context is present
 */
export function requireAuth(context: AuthContext): void {
  if (!context.userId && !context.clerkToken) {
    throw new Error('Authentication required. Please provide userId or clerkToken in request metadata.');
  }
}

