# Trilix Atlassian MCP Server

An MCP (Model Context Protocol) server that connects to multiple Atlassian workspaces (Jira and Confluence) using user-generated API keys. This allows you to query and interact with different Atlassian organizations in the same chat session.

## Quick Start with ChatGPT

**New to MCP?** See [CHATGPT_SETUP.md](CHATGPT_SETUP.md) for step-by-step instructions on connecting this server to ChatGPT.

## Features

- **Multi-workspace support**: Connect to multiple Atlassian workspaces simultaneously
- **Jira integration**: Search issues, create/update issues, manage projects, and more
- **Confluence integration**: Search content, retrieve pages, list spaces, and more
- **API key authentication**: Secure authentication using Atlassian API tokens
- **Workspace management**: Add, remove, and list configured workspaces

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Atlassian API tokens for each workspace you want to connect to
- (Optional) Clerk account for user authentication and secure API key storage

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd Trilix-Atlassian-MCP-Server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Getting Your Atlassian API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "MCP Server")
4. Copy the generated token (you'll only see it once)

## Configuration

### Clerk Authentication (Recommended)

For multi-user scenarios, the server supports Clerk authentication. Users authenticate with Clerk and their Atlassian API keys are securely stored in Clerk user metadata.

1. **Set up Clerk:**
   - Create an account at [Clerk Dashboard](https://dashboard.clerk.com)
   - Get your Secret Key from the API Keys section
   - Add it to your `.env` file:
     ```bash
     CLERK_SECRET_KEY=sk_test_your_secret_key_here
     ```

2. **Add workspaces with authentication:**
   ```json
   {
     "tool": "workspace_add",
     "arguments": {
       "workspaceName": "my-company",
       "baseUrl": "https://my-company.atlassian.net",
       "email": "your-email@example.com",
       "apiToken": "your-api-token-here"
     },
     "meta": {
       "clerkToken": "sess_xxx..." // Clerk session token
     }
   }
   ```

See [CLERK_SETUP.md](CLERK_SETUP.md) for detailed setup instructions.

### File-Based Storage (Fallback)

If Clerk is not configured, the server falls back to file-based storage. You can add workspaces using the MCP tools:

```json
{
  "tool": "workspace_add",
  "arguments": {
    "workspaceName": "my-company",
    "baseUrl": "https://my-company.atlassian.net",
    "email": "your-email@example.com",
    "apiToken": "your-api-token-here"
  }
}
```

Or manually edit `.config/workspaces.json`:

```json
[
  {
    "name": "my-company",
    "baseUrl": "https://my-company.atlassian.net",
    "email": "your-email@example.com",
    "apiToken": "your-api-token-here"
  },
  {
    "name": "another-company",
    "baseUrl": "https://another-company.atlassian.net",
    "email": "your-email@example.com",
    "apiToken": "another-api-token"
  }
]
```

## Usage

### Starting the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### Using with ChatGPT

To use this MCP server with ChatGPT, you need to add it to ChatGPT's Developer Tools:

1. **Build the server** (if not already built):
   ```bash
   npm run build
   ```

2. **Add the server in ChatGPT**:
   - Open ChatGPT → Settings → Tools → Developer Tools → Add Local MCP Server
   - Configure it with:
     - **Name**: `trilix-atlassian`
     - **Command**: `trilix-atlassian` (or `node` if not installed globally)
     - **Arguments**: `["--stdio"]`
     - **Working Directory**: The folder where your `dist/index.js` is located (typically the project root)

3. **Alternative: Using npm script directly**:
   If you haven't installed the package globally, you can use:
   - **Command**: `npm`
   - **Arguments**: `["start"]`
   - **Working Directory**: Your project root directory

4. **Verify connection**:
   Once added, ChatGPT should show: "Connected to trilix-atlassian"

5. **Start using it**:
   You can now ask ChatGPT to:
   - "List all issues in PWW using trilix-atlassian"
   - "Search Jira issues"
   - "Create a Jira issue"
   - "Search Confluence pages"
   - etc.

**Note**: The server uses stdio transport by default, so the `--stdio` flag is optional but included for compatibility with ChatGPT's MCP server configuration.

### Available Tools

#### Workspace Management

- **workspace_add**: Add a new workspace
- **workspace_list**: List all configured workspaces
- **workspace_remove**: Remove a workspace

#### Jira Tools

- **jira_search_issues**: Search for issues using JQL
  - Example: `jql: "project = PROJ AND status = Open"`
- **jira_get_issue**: Get a specific issue by key
- **jira_list_projects**: List all projects in a workspace
- **jira_get_project**: Get project details
- **jira_create_issue**: Create a new issue
- **jira_update_issue**: Update an existing issue
- **jira_transition_issue**: Transition an issue to a different status

#### Confluence Tools

- **confluence_search**: Search for content across workspaces
- **confluence_get_page**: Get a specific page by ID
- **confluence_list_spaces**: List all spaces in a workspace
- **confluence_get_space**: Get space details
- **confluence_list_pages**: List pages in a space

### Example Queries

**Search Jira issues across all workspaces:**
```json
{
  "tool": "jira_search_issues",
  "arguments": {
    "jql": "status = Open AND assignee = currentUser()"
  }
}
```

**Get a Confluence page:**
```json
{
  "tool": "confluence_get_page",
  "arguments": {
    "workspaceName": "my-company",
    "pageId": "123456"
  }
}
```

**Search Confluence content:**
```json
{
  "tool": "confluence_search",
  "arguments": {
    "query": "API documentation",
    "limit": 10
  }
}
```

## Security Notes

- API tokens are stored in plain text in `.config/workspaces.json`
- For production use, consider:
  - Encrypting the configuration file
  - Using environment variables for sensitive data
  - Implementing proper access controls
  - Storing tokens in a secure vault

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Watch for changes
npm run watch
```

## Troubleshooting

### Authentication Errors

- Verify your API token is correct
- Ensure your email matches the Atlassian account
- Check that the base URL is correct (should end with `.atlassian.net`)

### Connection Issues

- Verify network connectivity
- Check if the workspace URL is accessible
- Ensure API tokens haven't expired

### Workspace Not Found

- Use `workspace_list` to see configured workspaces
- Verify the workspace name is spelled correctly
- Check that the workspace was added successfully

## License

MIT

