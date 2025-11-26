# Clerk Authentication Setup

This MCP server supports Clerk authentication, allowing users to securely store their Atlassian API keys in their Clerk user metadata.

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign up or log in
3. Create a new application

### 2. Get Your Secret Key

1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. Add it to your `.env` file:

```bash
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### 3. Configure User Metadata

Clerk stores Atlassian workspaces in user `publicMetadata`. The structure is:

```json
{
  "atlassianWorkspaces": [
    {
      "name": "my-workspace",
      "baseUrl": "https://my-org.atlassian.net",
      "email": "user@example.com",
      "apiToken": "ATATT3x..."
    }
  ]
}
```

## How Authentication Works

### MCP Request Format

When making MCP requests, include authentication in the request metadata:

```json
{
  "method": "tools/call",
  "params": {
    "name": "workspace_add",
    "arguments": {
      "workspaceName": "my-workspace",
      "baseUrl": "https://my-org.atlassian.net",
      "email": "user@example.com",
      "apiToken": "ATATT3x..."
    },
    "meta": {
      "clerkToken": "your-clerk-session-token",
      "userId": "user_xxx" // Optional if token provided
    }
  }
}
```

### Authentication Flow

1. **User authenticates with Clerk** (via your frontend/app)
2. **Clerk provides a session token**
3. **MCP requests include the token** in request metadata
4. **Server verifies token** and extracts user ID
5. **Workspaces are stored/retrieved** from Clerk user metadata

## Fallback Mode

If `CLERK_SECRET_KEY` is not set, the server falls back to file-based storage (`.config/workspaces.json`). This is useful for:
- Development/testing
- Single-user scenarios
- Local deployments

## Security Notes

- **API tokens are encrypted** in Clerk's secure storage
- **User metadata is private** - each user only sees their own workspaces
- **Tokens never exposed** in API responses
- **Session tokens expire** - users need to re-authenticate periodically

## Example: Adding a Workspace

With Clerk authentication:

```json
{
  "tool": "workspace_add",
  "arguments": {
    "workspaceName": "acme-corp",
    "baseUrl": "https://acme-corp.atlassian.net",
    "email": "john@acme.com",
    "apiToken": "ATATT3x..."
  },
  "meta": {
    "clerkToken": "sess_xxx..."
  }
}
```

The workspace will be stored in the authenticated user's Clerk metadata and will only be accessible to that user.

