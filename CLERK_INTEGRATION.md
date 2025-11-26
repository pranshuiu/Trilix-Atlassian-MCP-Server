# Clerk Authentication Integration

The MCP server now supports Clerk authentication, allowing users to securely authenticate and store their Atlassian API keys in Clerk user metadata.

## Architecture

### Authentication Flow

```
User → Clerk Auth → MCP Request (with token) → Server verifies token → User-scoped workspaces
```

1. **User authenticates** with Clerk (via your frontend/application)
2. **Clerk provides session token** to the client
3. **MCP requests include token** in request metadata
4. **Server verifies token** using Clerk backend SDK
5. **Workspaces stored/retrieved** from Clerk user metadata (per user)

### Storage Architecture

- **With Clerk**: Workspaces stored in `user.publicMetadata.atlassianWorkspaces[]`
- **Without Clerk**: Falls back to `.config/workspaces.json` (file-based)

## Setup

### 1. Install Clerk

The `@clerk/backend` package is already included in `package.json`.

### 2. Configure Environment

Create a `.env` file:

```bash
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

Get your secret key from: https://dashboard.clerk.com → API Keys

### 3. How It Works

#### Adding a Workspace (with Clerk)

```json
{
  "method": "tools/call",
  "params": {
    "name": "workspace_add",
    "arguments": {
      "workspaceName": "my-company",
      "baseUrl": "https://my-company.atlassian.net",
      "email": "user@example.com",
      "apiToken": "ATATT3x..."
    },
    "meta": {
      "clerkToken": "sess_xxx..." // Clerk session token
    }
  }
}
```

The workspace is stored in the authenticated user's Clerk metadata.

#### Querying (with Clerk)

All subsequent requests automatically use the user's workspaces:

```json
{
  "method": "tools/call",
  "params": {
    "name": "jira_search_issues",
    "arguments": {
      "jql": "status = Open"
    },
    "meta": {
      "clerkToken": "sess_xxx..."
    }
  }
}
```

## User Isolation

- Each user's workspaces are **completely isolated**
- User A cannot see User B's workspaces
- API keys are stored securely in Clerk's infrastructure
- No cross-user data leakage

## Fallback Mode

If `CLERK_SECRET_KEY` is not set:
- Server operates in **file-based mode**
- Workspaces stored in `.config/workspaces.json`
- Suitable for single-user or development scenarios

## Security Benefits

1. **Encrypted Storage**: API keys stored in Clerk's secure infrastructure
2. **User Isolation**: Each user only sees their own workspaces
3. **Token Verification**: All requests verified against Clerk
4. **No Local Storage**: API keys never stored in plain text files (when using Clerk)

## API Changes

### Request Metadata

All MCP requests can now include authentication metadata:

```json
{
  "meta": {
    "clerkToken": "sess_xxx...",  // Clerk session token
    "userId": "user_xxx"          // Optional: direct user ID (if token not provided)
  }
}
```

### Workspace Management

- `workspace_add`: Stores workspace in Clerk user metadata (if authenticated)
- `workspace_list`: Returns only the authenticated user's workspaces
- `workspace_remove`: Removes workspace from authenticated user's metadata

### All Tools

All Jira and Confluence tools now support user-scoped workspaces:
- If `userId` is provided, only that user's workspaces are accessible
- If no `userId`, falls back to file-based storage

## Migration

### From File-Based to Clerk

1. Set `CLERK_SECRET_KEY` in `.env`
2. Users authenticate and add workspaces via MCP with `clerkToken`
3. Workspaces automatically stored in Clerk
4. Old `.config/workspaces.json` can be removed (or kept as backup)

### Backward Compatibility

- Server works **without Clerk** (file-based mode)
- Server works **with Clerk** (user-scoped mode)
- No breaking changes to existing tools

