# Atlassian API Coverage

This document outlines the comprehensive API coverage provided by the MCP server.

## Current Coverage

### Jira API Coverage

#### Issues
- ✅ Search issues (JQL) - `jira_search_issues`
- ✅ Get issue - `jira_get_issue`
- ✅ Create issue - `jira_create_issue`
- ✅ Update issue - `jira_update_issue`
- ✅ Delete issue - `jira_delete_issue`
- ✅ Transition issue - `jira_transition_issue`

#### Comments
- ✅ Get comments - `jira_get_comments`
- ✅ Add comment - `jira_add_comment`
- ✅ Update comment - `jira_update_comment`
- ✅ Delete comment - `jira_delete_comment`

#### Attachments
- ✅ Get attachments - `jira_get_attachments`

#### Worklogs
- ✅ Get worklogs - `jira_get_worklogs`
- ✅ Add worklog - `jira_add_worklog`

#### Projects
- ✅ List projects - `jira_list_projects`
- ✅ Get project - `jira_get_project`
- ✅ Search projects - `jira_search_projects`
- ✅ Get project components - `jira_get_project_components`
- ✅ Get project versions - `jira_get_project_versions`

#### Users
- ✅ Search users - `jira_search_users`
- ✅ Get user - `jira_get_user`
- ✅ Get current user - `jira_get_current_user`

#### Boards & Sprints (via API call)
- ✅ Get boards - `jira_get_boards` (uses agile API)
- ✅ Get board - `jira_get_board` (uses agile API)
- ✅ Get sprints - `jira_get_sprints` (uses agile API)

#### Filters
- ✅ Get filters - `jira_get_filters`

#### Fields & Metadata
- ✅ Get fields - `jira_get_fields`
- ✅ Get priorities - `jira_get_priorities`
- ✅ Get resolutions - `jira_get_resolutions`
- ✅ Get statuses - `jira_get_statuses`
- ✅ Get issue types - `jira_get_issue_types`

#### Generic API Access
- ✅ Direct API calls - `jira_api_call` (access any Jira API endpoint)

### Confluence API Coverage

#### Content
- ✅ Search content (CQL) - `confluence_search`
- ✅ Get content by ID - `confluence_get_page`
- ✅ List content - `confluence_list_pages`
- ✅ Create page - `confluence_create_page`
- ✅ Update page - `confluence_update_page`
- ✅ Delete page - `confluence_delete_page`
- ✅ Get content by type - `confluence_get_content_by_type`
- ✅ Get content history - `confluence_get_content_history`

#### Spaces
- ✅ List spaces - `confluence_list_spaces`
- ✅ Get space - `confluence_get_space`

#### Attachments
- ✅ Get attachments - `confluence_get_attachments`

#### Comments
- ✅ Get comments - `confluence_get_comments`
- ✅ Add comment - `confluence_add_comment`

#### Labels
- ✅ Get labels - `confluence_get_labels`
- ✅ Add labels - `confluence_add_labels`

#### Generic API Access
- ✅ Direct API calls - `confluence_api_call` (access any Confluence API endpoint)

## Total Tools Available

- **Jira Tools**: 30+ specific tools + 1 generic API call tool
- **Confluence Tools**: 15+ specific tools + 1 generic API call tool
- **Workspace Management**: 3 tools (add, list, remove)

## Using the Generic API Call Tools

For operations not explicitly covered, use the generic API call tools:

### Jira API Call
```json
{
  "tool": "jira_api_call",
  "arguments": {
    "workspaceName": "my-workspace",
    "service": "issues",
    "method": "getIssue",
    "parameters": {
      "issueIdOrKey": "PROJ-123",
      "expand": ["renderedFields"]
    }
  }
}
```

### Confluence API Call
```json
{
  "tool": "confluence_api_call",
  "arguments": {
    "workspaceName": "my-workspace",
    "service": "content",
    "method": "getContentById",
    "parameters": {
      "id": "123456",
      "expand": ["body.storage"]
    }
  }
}
```

This provides **complete access** to the entire Atlassian API surface through both specific tools and generic API calls.
