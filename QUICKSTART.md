# Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Adding Your First Workspace

You can add a workspace using the MCP tool `workspace_add` with the following parameters:

- `workspaceName`: A friendly name for your workspace (e.g., "my-company")
- `baseUrl`: Your Atlassian instance URL (e.g., "https://my-company.atlassian.net")
- `email`: Your Atlassian account email
- `apiToken`: Your Atlassian API token

### Getting Your API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label and copy the token

## Running the Server

```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Example Usage

Once connected to ChatGPT or another MCP client, you can:

1. **Add a workspace:**
   - Tool: `workspace_add`
   - Parameters: workspaceName, baseUrl, email, apiToken

2. **Search Jira issues:**
   - Tool: `jira_search_issues`
   - Parameters: jql (e.g., "project = PROJ AND status = Open")

3. **Search Confluence:**
   - Tool: `confluence_search`
   - Parameters: query (e.g., "API documentation")

4. **List workspaces:**
   - Tool: `workspace_list`

## Configuration File

Workspaces are automatically saved to `.config/workspaces.json`. You can also manually edit this file if needed.

