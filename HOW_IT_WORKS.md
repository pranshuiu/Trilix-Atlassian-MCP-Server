# How the Atlassian MCP Server Works

## Architecture Overview

This MCP (Model Context Protocol) server acts as a bridge between ChatGPT (or other MCP clients) and multiple Atlassian workspaces. It allows you to query Jira and Confluence from different organizations in the same chat session.

### Key Components

```
┌─────────────────┐
│   ChatGPT/MCP   │
│     Client      │
└────────┬────────┘
         │ MCP Protocol (JSON-RPC over stdio)
         │
┌────────▼─────────────────────────────┐
│      MCP Server (index.ts)           │
│  - Routes tool calls                  │
│  - Manages requests/responses        │
└────────┬─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼──────────┐
│ Jira  │ │ Confluence   │
│ Tools │ │ Tools        │
└───┬───┘ └───┬──────────┘
    │         │
    └────┬────┘
         │
┌────────▼─────────────────────────────┐
│   WorkspaceManager                    │
│  - Stores multiple workspace configs   │
│  - Creates Jira/Confluence clients    │
│  - Manages API authentication        │
└────────┬─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼──────────┐
│ Jira  │ │ Confluence   │
│ API   │ │ API          │
└───────┘ └──────────────┘
```

## How It Works Step-by-Step

### 1. **Server Startup** (`src/index.ts`)
- The server starts and creates an MCP Server instance
- It initializes:
  - `WorkspaceManager` - loads saved workspaces from `.config/workspaces.json`
  - `ConfluenceTools` - handles Confluence operations
  - `JiraTools` - handles Jira operations
- Server listens on stdio (standard input/output) for MCP protocol messages

### 2. **Workspace Management** (`src/workspace-manager.ts`)
- **On startup**: Automatically loads all workspaces from `.config/workspaces.json`
- **For each workspace**: Creates authenticated clients for:
  - Jira (using `jira.js` library)
  - Confluence (using `confluence.js` library)
- **Stores credentials**: API tokens are stored in memory and persisted to the config file

### 3. **Tool Routing** (`src/index.ts`)
When ChatGPT calls a tool:
- Server receives a tool call request (e.g., `jira_search_issues`)
- Routes to appropriate handler:
  - `confluence_*` → `ConfluenceTools`
  - `jira_*` → `JiraTools`
  - `workspace_*` → Built-in workspace management
- Executes the tool with provided parameters
- Returns results back to ChatGPT

### 4. **Multi-Workspace Support**
- Each workspace has a unique name (e.g., "my-company", "client-org")
- Tools can:
  - Target a specific workspace: `{ workspaceName: "my-company", ... }`
  - Search across ALL workspaces: `{ query: "...", ... }` (no workspaceName)
- The server automatically queries all configured workspaces and aggregates results

## How to Add Your Atlassian Credentials

You have **two methods** to add your Atlassian workspace credentials:

### Method 1: Using MCP Tools (Recommended - Via ChatGPT)

Once the server is running and connected to ChatGPT, you can add workspaces directly through the chat:

**Example conversation:**
```
You: "Add my Atlassian workspace"
ChatGPT: "I'll help you add your workspace. I need:
- Workspace name (e.g., 'my-company')
- Base URL (e.g., 'https://my-company.atlassian.net')
- Your email address
- Your API token"

You: "Workspace name: my-company, URL: https://my-company.atlassian.net, 
     Email: john@example.com, Token: ATATT3xFfGF0..."
```

ChatGPT will use the `workspace_add` tool with your credentials.

### Method 2: Manual Configuration File

1. **Get Your API Token:**
   - Go to: https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Give it a label (e.g., "MCP Server")
   - **Copy the token immediately** (you won't see it again!)

2. **Create/Edit Configuration File:**
   - Navigate to: `.config/workspaces.json`
   - If the file doesn't exist, create it based on `.config/workspaces.json.example`

3. **Add Your Workspace:**
   ```json
   [
     {
       "name": "my-company",
       "baseUrl": "https://my-company.atlassian.net",
       "email": "your-email@example.com",
       "apiToken": "ATATT3xFfGF0..."
     },
     {
       "name": "client-org",
       "baseUrl": "https://client-org.atlassian.net",
       "email": "your-email@example.com",
       "apiToken": "ATATT3xAbCd..."
     }
   ]
   ```

4. **Restart the Server:**
   - The server automatically loads workspaces on startup
   - If the server is running, restart it to load new workspaces

## Configuration File Structure

The `.config/workspaces.json` file structure:

```json
[
  {
    "name": "unique-workspace-name",        // Friendly name (used in queries)
    "baseUrl": "https://company.atlassian.net",  // Your Atlassian instance URL
    "email": "your-email@example.com",     // Your Atlassian account email
    "apiToken": "ATATT3xFfGF0..."          // Your API token
  }
]
```

### Field Descriptions:

- **`name`**: A friendly identifier for this workspace (e.g., "my-company", "client-org")
  - Used when specifying which workspace to query
  - Must be unique across all workspaces

- **`baseUrl`**: Your Atlassian instance URL
  - Format: `https://[your-org].atlassian.net`
  - Example: `https://acme-corp.atlassian.net`

- **`email`**: Your Atlassian account email address
  - The email you use to log into Atlassian
  - Must match the account that generated the API token

- **`apiToken`**: Your Atlassian API token
  - Generated from: https://id.atlassian.com/manage-profile/security/api-tokens
  - Starts with `ATATT3x...`
  - Keep this secret! Never commit it to version control

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Token Storage:**
   - Tokens are stored in **plain text** in `.config/workspaces.json`
   - This file is **gitignored** (not committed to version control)
   - For production use, consider:
     - Encrypting the configuration file
     - Using environment variables
     - Using a secure vault (e.g., AWS Secrets Manager, HashiCorp Vault)

2. **File Permissions:**
   - Ensure `.config/workspaces.json` has restricted permissions:
     ```bash
     chmod 600 .config/workspaces.json  # Linux/Mac
     ```

3. **Token Rotation:**
   - Regularly rotate your API tokens
   - If a token is compromised, revoke it immediately in Atlassian settings

## Example: Adding Multiple Workspaces

```json
[
  {
    "name": "acme-corp",
    "baseUrl": "https://acme-corp.atlassian.net",
    "email": "john@acme.com",
    "apiToken": "ATATT3xFfGF0abc123..."
  },
  {
    "name": "client-company",
    "baseUrl": "https://client-company.atlassian.net",
    "email": "john@acme.com",
    "apiToken": "ATATT3xDef456..."
  },
  {
    "name": "personal-project",
    "baseUrl": "https://personal.atlassian.net",
    "email": "john@personal.com",
    "apiToken": "ATATT3xGhi789..."
  }
]
```

## Testing Your Configuration

After adding credentials, you can test:

1. **List workspaces:**
   - Use the `workspace_list` tool via ChatGPT
   - Or check the file directly

2. **Test a query:**
   - Try: "Search for open issues in my-company workspace"
   - Or: "List all spaces in my-company Confluence"

3. **Check for errors:**
   - If authentication fails, verify:
     - Email matches your Atlassian account
     - API token is correct and not expired
     - Base URL is correct (no trailing slash)

## Troubleshooting

**Problem: "Workspace not found"**
- Check that the workspace name matches exactly (case-sensitive)
- Verify `.config/workspaces.json` exists and is valid JSON
- Restart the server after adding workspaces

**Problem: "Authentication failed"**
- Verify your API token is correct
- Check that your email matches your Atlassian account
- Ensure the base URL is correct (format: `https://[org].atlassian.net`)

**Problem: "Jira/Confluence client not available"**
- Check that the workspace was loaded successfully
- Verify the API token has proper permissions
- Check server logs for initialization errors

