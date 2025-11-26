# ChatGPT Integration Guide

This guide will help you set up the Trilix Atlassian MCP Server to work with ChatGPT's Developer Tools.

## Prerequisites

1. **Build the server**:
   ```bash
   npm install
   npm run build
   ```

2. **Verify the build**:
   Make sure `dist/index.js` exists in your project root.

## Setting Up in ChatGPT

### Step 1: Open Developer Tools

1. Open ChatGPT
2. Go to **Settings** (gear icon)
3. Navigate to **Tools** → **Developer Tools**
4. Click **Add Local MCP Server**

### Step 2: Configure the Server

You have two options depending on how you want to run the server:

#### Option A: Using the Binary (Recommended if installed globally)

If you've installed the package globally (`npm install -g`), use:

- **Name**: `trilix-atlassian`
- **Command**: `trilix-atlassian`
- **Arguments**: `["--stdio"]`
- **Working Directory**: Leave empty or set to your project root

#### Option B: Using Node.js Directly (Recommended for local development)

- **Name**: `trilix-atlassian`
- **Command**: `node`
- **Arguments**: `["dist/index.js", "--stdio"]`
- **Working Directory**: `D:\Idea Usher\Trilix-Atlassian-MCP-Server` (or your project path)

#### Option C: Using npm Script

- **Name**: `trilix-atlassian`
- **Command**: `npm`
- **Arguments**: `["start"]`
- **Working Directory**: `D:\Idea Usher\Trilix-Atlassian-MCP-Server` (or your project path)

**Note**: For Windows users, use forward slashes or escaped backslashes in the path, or use the full absolute path.

### Step 3: Verify Connection

After adding the server, ChatGPT should display:
```
Connected to trilix-atlassian
```

If you see an error, check:
- The `dist/index.js` file exists
- The working directory path is correct
- Node.js is in your system PATH
- You've run `npm run build` successfully

## Using the Server

Once connected, you can interact with your Atlassian workspaces through ChatGPT:

### Example Commands

**Add a workspace:**
```
"Add my Atlassian workspace called 'my-company' with URL https://my-company.atlassian.net"
```

**Search Jira issues:**
```
"List all open issues in project PROJ using trilix-atlassian"
"Search for Jira issues assigned to me"
```

**Get issue details:**
```
"Get details for Jira issue PROJ-123"
```

**Create issues:**
```
"Create a new Jira issue in project PROJ with title 'Fix bug' and description 'Description here'"
```

**Search Confluence:**
```
"Search Confluence for 'API documentation'"
"List all Confluence spaces"
"Get Confluence page with ID 123456"
```

**Workspace management:**
```
"List all my configured Atlassian workspaces"
"Remove workspace 'old-company'"
```

## Troubleshooting

### Server Not Connecting

1. **Check the build**:
   ```bash
   npm run build
   ```

2. **Test the server manually**:
   ```bash
   node dist/index.js --stdio
   ```
   The server should start without errors (it will wait for input on stdio).

3. **Check Node.js version**:
   ```bash
   node --version
   ```
   Should be Node.js 18 or higher.

4. **Verify file paths**:
   - Make sure the working directory in ChatGPT settings matches your project root
   - Ensure `dist/index.js` exists relative to the working directory

### Authentication Issues

If you're using Clerk authentication:
- Make sure `CLERK_SECRET_KEY` is set in your environment or `.env` file
- Verify your Clerk token is valid when making requests

If using file-based storage:
- Check that `.config/workspaces.json` exists and is properly formatted
- Ensure you have the correct permissions to read/write the file

### Workspace Not Found

- Use `workspace_list` to see all configured workspaces
- Verify workspace names are spelled correctly
- Check that workspaces were added successfully

## Advanced Configuration

### Environment Variables

Create a `.env` file in your project root for configuration:

```bash
# Optional: Clerk authentication
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### Multiple Workspaces

You can configure multiple Atlassian workspaces. Each workspace needs:
- A unique name
- Base URL (e.g., `https://company.atlassian.net`)
- Email address
- API token

Add workspaces through ChatGPT or by editing `.config/workspaces.json` (if not using Clerk).

## Next Steps

- Read the [README.md](README.md) for full API documentation
- Check [CLERK_SETUP.md](CLERK_SETUP.md) for Clerk authentication setup
- Review [HOW_IT_WORKS.md](HOW_IT_WORKS.md) for architecture details

