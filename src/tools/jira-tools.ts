import { WorkspaceManager } from '../workspace-manager.js';

export class JiraTools {
  constructor(private workspaceManager: WorkspaceManager) {}

  async listTools() {
    return [
      {
        name: 'jira_search_issues',
        description: 'Search for Jira issues using JQL (Jira Query Language)',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace to search in. If not provided, searches all workspaces.',
            },
            jql: {
              type: 'string',
              description: 'JQL query string (e.g., "project = PROJ AND status = Open")',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of issues to return (default: 50)',
              default: 50,
            },
          },
          required: ['jql'],
        },
      },
      {
        name: 'jira_get_issue',
        description: 'Get a specific Jira issue by key or ID',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key (e.g., PROJ-123) or ID',
            },
            expand: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to expand (e.g., ["renderedFields", "names", "schema", "transitions"])',
            },
          },
          required: ['workspaceName', 'issueKey'],
        },
      },
      {
        name: 'jira_list_projects',
        description: 'List all projects in a Jira workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of projects to return (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_project',
        description: 'Get details about a specific project',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            projectKeyOrId: {
              type: 'string',
              description: 'The project key or ID',
            },
          },
          required: ['workspaceName', 'projectKeyOrId'],
        },
      },
      {
        name: 'jira_create_issue',
        description: 'Create a new Jira issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            projectKey: {
              type: 'string',
              description: 'The project key',
            },
            summary: {
              type: 'string',
              description: 'Issue summary/title',
            },
            issueType: {
              type: 'string',
              description: 'Issue type (e.g., "Bug", "Task", "Story")',
            },
            description: {
              type: 'string',
              description: 'Issue description',
            },
            assignee: {
              type: 'string',
              description: 'Assignee account ID (optional)',
            },
          },
          required: ['workspaceName', 'projectKey', 'summary', 'issueType'],
        },
      },
      {
        name: 'jira_update_issue',
        description: 'Update an existing Jira issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key (e.g., PROJ-123)',
            },
            fields: {
              type: 'object',
              description: 'Fields to update (e.g., { summary: "New title", description: "New description" })',
            },
          },
          required: ['workspaceName', 'issueKey', 'fields'],
        },
      },
      {
        name: 'jira_transition_issue',
        description: 'Transition an issue to a different status',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key (e.g., PROJ-123)',
            },
            transitionId: {
              type: 'string',
              description: 'The transition ID (use jira_get_issue with expand=["transitions"] to find available transitions)',
            },
          },
          required: ['workspaceName', 'issueKey', 'transitionId'],
        },
      },
      {
        name: 'jira_delete_issue',
        description: 'Delete a Jira issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID to delete',
            },
            deleteSubtasks: {
              type: 'boolean',
              description: 'Whether to delete subtasks (default: false)',
              default: false,
            },
          },
          required: ['workspaceName', 'issueKey'],
        },
      },
      {
        name: 'jira_get_comments',
        description: 'Get all comments for an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
            expand: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to expand',
            },
          },
          required: ['workspaceName', 'issueKey'],
        },
      },
      {
        name: 'jira_add_comment',
        description: 'Add a comment to an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
            body: {
              type: 'string',
              description: 'Comment body/text',
            },
            visibility: {
              type: 'object',
              description: 'Visibility settings (optional)',
            },
          },
          required: ['workspaceName', 'issueKey', 'body'],
        },
      },
      {
        name: 'jira_update_comment',
        description: 'Update a comment on an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
            commentId: {
              type: 'string',
              description: 'The comment ID',
            },
            body: {
              type: 'string',
              description: 'Updated comment body/text',
            },
            visibility: {
              type: 'object',
              description: 'Visibility settings (optional)',
            },
          },
          required: ['workspaceName', 'issueKey', 'commentId', 'body'],
        },
      },
      {
        name: 'jira_delete_comment',
        description: 'Delete a comment from an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
            commentId: {
              type: 'string',
              description: 'The comment ID to delete',
            },
          },
          required: ['workspaceName', 'issueKey', 'commentId'],
        },
      },
      {
        name: 'jira_get_attachments',
        description: 'Get all attachments for an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
          },
          required: ['workspaceName', 'issueKey'],
        },
      },
      {
        name: 'jira_get_worklogs',
        description: 'Get worklogs for an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
            startAt: {
              type: 'number',
              description: 'Starting index (default: 0)',
              default: 0,
            },
            maxResults: {
              type: 'number',
              description: 'Maximum results (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName', 'issueKey'],
        },
      },
      {
        name: 'jira_add_worklog',
        description: 'Add a worklog to an issue',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            issueKey: {
              type: 'string',
              description: 'The issue key or ID',
            },
            timeSpent: {
              type: 'string',
              description: 'Time spent (e.g., "2h 30m", "1d")',
            },
            comment: {
              type: 'string',
              description: 'Worklog comment (optional)',
            },
            started: {
              type: 'string',
              description: 'Start date/time in ISO format (optional)',
            },
          },
          required: ['workspaceName', 'issueKey', 'timeSpent'],
        },
      },
      {
        name: 'jira_search_users',
        description: 'Search for users',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            query: {
              type: 'string',
              description: 'Search query (username, display name, or email)',
            },
            startAt: {
              type: 'number',
              description: 'Starting index (default: 0)',
              default: 0,
            },
            maxResults: {
              type: 'number',
              description: 'Maximum results (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName', 'query'],
        },
      },
      {
        name: 'jira_get_user',
        description: 'Get user details',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            accountId: {
              type: 'string',
              description: 'User account ID',
            },
            expand: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to expand',
            },
          },
          required: ['workspaceName', 'accountId'],
        },
      },
      {
        name: 'jira_get_current_user',
        description: 'Get the current authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            expand: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to expand',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_search_projects',
        description: 'Search for projects with filters',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            query: {
              type: 'string',
              description: 'Search query (optional)',
            },
            keys: {
              type: 'array',
              items: { type: 'string' },
              description: 'Project keys to filter by (optional)',
            },
            startAt: {
              type: 'number',
              description: 'Starting index (default: 0)',
              default: 0,
            },
            maxResults: {
              type: 'number',
              description: 'Maximum results (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_project_components',
        description: 'Get components for a project',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            projectKeyOrId: {
              type: 'string',
              description: 'The project key or ID',
            },
          },
          required: ['workspaceName', 'projectKeyOrId'],
        },
      },
      {
        name: 'jira_get_project_versions',
        description: 'Get versions for a project',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            projectKeyOrId: {
              type: 'string',
              description: 'The project key or ID',
            },
          },
          required: ['workspaceName', 'projectKeyOrId'],
        },
      },
      {
        name: 'jira_get_fields',
        description: 'Get all fields in Jira',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_priorities',
        description: 'Get all issue priorities',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_resolutions',
        description: 'Get all issue resolutions',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_statuses',
        description: 'Get all issue statuses',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_issue_types',
        description: 'Get all issue types',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_boards',
        description: 'Get all boards',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            startAt: {
              type: 'number',
              description: 'Starting index (default: 0)',
              default: 0,
            },
            maxResults: {
              type: 'number',
              description: 'Maximum results (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_get_board',
        description: 'Get a specific board',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            boardId: {
              type: 'number',
              description: 'The board ID',
            },
          },
          required: ['workspaceName', 'boardId'],
        },
      },
      {
        name: 'jira_get_sprints',
        description: 'Get sprints for a board',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            boardId: {
              type: 'number',
              description: 'The board ID',
            },
            startAt: {
              type: 'number',
              description: 'Starting index (default: 0)',
              default: 0,
            },
            maxResults: {
              type: 'number',
              description: 'Maximum results (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName', 'boardId'],
        },
      },
      {
        name: 'jira_get_filters',
        description: 'Get all saved filters',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            expand: {
              type: 'string',
              description: 'Fields to expand (optional)',
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'jira_api_call',
        description: 'Make a direct API call to any Jira endpoint. Use this for advanced operations not covered by specific tools. Service names: issues, projects, users, boards, sprints, filters, fields, priorities, resolutions, statuses, issueTypes, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            service: {
              type: 'string',
              description: 'Service name (e.g., "issues", "projects", "users")',
            },
            method: {
              type: 'string',
              description: 'Method name on the service (e.g., "getIssue", "createIssue")',
            },
            parameters: {
              type: 'object',
              description: 'Parameters object to pass to the method',
            },
          },
          required: ['workspaceName', 'service', 'method'],
        },
      },
    ];
  }

  async handleTool(name: string, args: any, userId?: string) {
    switch (name) {
      case 'jira_search_issues':
        return await this.searchIssues(args, userId);
      case 'jira_get_issue':
        return await this.getIssue(args, userId);
      case 'jira_list_projects':
        return await this.listProjects(args, userId);
      case 'jira_get_project':
        return await this.getProject(args, userId);
      case 'jira_create_issue':
        return await this.createIssue(args, userId);
      case 'jira_update_issue':
        return await this.updateIssue(args, userId);
      case 'jira_transition_issue':
        return await this.transitionIssue(args, userId);
      case 'jira_delete_issue':
        return await this.deleteIssue(args, userId);
      case 'jira_get_comments':
        return await this.getComments(args, userId);
      case 'jira_add_comment':
        return await this.addComment(args, userId);
      case 'jira_update_comment':
        return await this.updateComment(args, userId);
      case 'jira_delete_comment':
        return await this.deleteComment(args, userId);
      case 'jira_get_attachments':
        return await this.getAttachments(args, userId);
      case 'jira_get_worklogs':
        return await this.getWorklogs(args, userId);
      case 'jira_add_worklog':
        return await this.addWorklog(args, userId);
      case 'jira_search_users':
        return await this.searchUsers(args, userId);
      case 'jira_get_user':
        return await this.getUser(args, userId);
      case 'jira_get_current_user':
        return await this.getCurrentUser(args, userId);
      case 'jira_search_projects':
        return await this.searchProjects(args, userId);
      case 'jira_get_project_components':
        return await this.getProjectComponents(args, userId);
      case 'jira_get_project_versions':
        return await this.getProjectVersions(args, userId);
      case 'jira_get_fields':
        return await this.getFields(args, userId);
      case 'jira_get_priorities':
        return await this.getPriorities(args, userId);
      case 'jira_get_resolutions':
        return await this.getResolutions(args, userId);
      case 'jira_get_statuses':
        return await this.getStatuses(args, userId);
      case 'jira_get_issue_types':
        return await this.getIssueTypes(args, userId);
      case 'jira_get_boards':
        return await this.getBoards(args, userId);
      case 'jira_get_board':
        return await this.getBoard(args, userId);
      case 'jira_get_sprints':
        return await this.getSprints(args, userId);
      case 'jira_get_filters':
        return await this.getFilters(args, userId);
      case 'jira_api_call':
        return await this.apiCall(args, userId);
      default:
        throw new Error(`Unknown Jira tool: ${name}`);
    }
  }

  private async searchIssues(args: {
    workspaceName?: string;
    jql: string;
    limit?: number;
  }, userId?: string) {
    try {
      const { workspaceName, jql, limit = 50 } = args;

      if (workspaceName) {
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
        const results = await client.issueSearch.searchForIssuesUsingJql({
          jql,
          maxResults: limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  workspace: workspaceName,
                  jql,
                  total: results.total,
                  issues: results.issues,
                },
                null,
                2
              ),
            },
          ],
        };
      } else {
        // Search across all workspaces
        const workspaces = await this.workspaceManager.listWorkspaces(userId);
        const allResults: any[] = [];

        for (const workspace of workspaces) {
          try {
            const client = await this.workspaceManager.getJiraClient(workspace.name, userId);
            const results = await client.issueSearch.searchForIssuesUsingJql({
              jql,
              maxResults: Math.floor(limit / workspaces.length) || 1,
            });
            allResults.push({
              workspace: workspace.name,
              total: results.total,
              issues: results.issues,
            });
          } catch (error: any) {
            allResults.push({
              workspace: workspace.name,
              error: error.message,
            });
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  jql,
                  results: allResults,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    } catch (error: any) {
      throw new Error(`Jira search failed: ${error.message}`);
    }
  }

  private async getIssue(args: {
    workspaceName: string;
    issueKey: string;
    expand?: string[];
  }, userId?: string) {
    try {
      const { workspaceName, issueKey, expand } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const issue = await client.issues.getIssue({
        issueIdOrKey: issueKey,
        expand: expand || ['renderedFields', 'names', 'schema', 'transitions'],
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                issue,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get Jira issue: ${error.message}`);
    }
  }

  private async listProjects(args: { workspaceName: string; limit?: number }, userId?: string) {
    try {
      const { workspaceName, limit = 50 } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const projects = await client.projects.searchProjects({
        maxResults: limit,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                projects,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to list Jira projects: ${error.message}`);
    }
  }

  private async getProject(args: { workspaceName: string; projectKeyOrId: string }, userId?: string) {
    try {
      const { workspaceName, projectKeyOrId } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const project = await client.projects.getProject({
        projectIdOrKey: projectKeyOrId,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                project,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get Jira project: ${error.message}`);
    }
  }

  private async createIssue(args: {
    workspaceName: string;
    projectKey: string;
    summary: string;
    issueType: string;
    description?: string;
    assignee?: string;
  }, userId?: string) {
    try {
      const { workspaceName, projectKey, summary, issueType, description, assignee } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);

      const issueData: any = {
        fields: {
          project: {
            key: projectKey,
          },
          summary,
          issuetype: {
            name: issueType,
          },
        },
      };

      if (description) {
        issueData.fields.description = description;
      }

      if (assignee) {
        issueData.fields.assignee = {
          accountId: assignee,
        };
      }

      const issue = await client.issues.createIssue(issueData);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                created: issue,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to create Jira issue: ${error.message}`);
    }
  }

  private async updateIssue(args: {
    workspaceName: string;
    issueKey: string;
    fields: any;
  }, userId?: string) {
    try {
      const { workspaceName, issueKey, fields } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const issue = await client.issues.editIssue({
        issueIdOrKey: issueKey,
        fields,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                updated: issue,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to update Jira issue: ${error.message}`);
    }
  }

  private async transitionIssue(args: {
    workspaceName: string;
    issueKey: string;
    transitionId: string;
  }, userId?: string) {
    try {
      const { workspaceName, issueKey, transitionId } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      await client.issues.doTransition({
        issueIdOrKey: issueKey,
        transition: {
          id: transitionId,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                issueKey,
                message: `Issue ${issueKey} transitioned successfully`,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to transition Jira issue: ${error.message}`);
    }
  }

  private async deleteIssue(args: { workspaceName: string; issueKey: string; deleteSubtasks?: boolean }, userId?: string) {
    try {
      const { workspaceName, issueKey, deleteSubtasks = false } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      await client.issues.deleteIssue({
        issueIdOrKey: issueKey,
        deleteSubtasks,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueKey, message: 'Issue deleted successfully' }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to delete Jira issue: ${error.message}`);
    }
  }

  private async getComments(args: { workspaceName: string; issueKey: string; expand?: string[] }, userId?: string) {
    try {
      const { workspaceName, issueKey, expand } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const comments = await client.issueComments.getComments({
        issueIdOrKey: issueKey,
        expand: expand?.join(','),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueKey, comments }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  private async addComment(args: { workspaceName: string; issueKey: string; body: string; visibility?: any }, userId?: string) {
    try {
      const { workspaceName, issueKey, body, visibility } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      // Use API call for comments as the body format is complex
      return await this.apiCall({
        workspaceName,
        service: 'issueComments',
        method: 'addComment',
        parameters: {
          issueIdOrKey: issueKey,
          body: { content: [{ type: 'paragraph', content: [{ type: 'text', text: body }] }], type: 'doc', version: 1 },
          visibility,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }

  private async updateComment(args: { workspaceName: string; issueKey: string; commentId: string; body: string; visibility?: any }, userId?: string) {
    try {
      const { workspaceName, issueKey, commentId, body, visibility } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const comment = await client.issueComments.updateComment({
        issueIdOrKey: issueKey,
        id: commentId,
        body: body,
        visibility,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueKey, commentId, comment }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to update comment: ${error.message}`);
    }
  }

  private async deleteComment(args: { workspaceName: string; issueKey: string; commentId: string }, userId?: string) {
    try {
      const { workspaceName, issueKey, commentId } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      await client.issueComments.deleteComment({
        issueIdOrKey: issueKey,
        id: commentId,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueKey, commentId, message: 'Comment deleted successfully' }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  private async getAttachments(args: { workspaceName: string; issueKey: string }, userId?: string) {
    try {
      const { workspaceName, issueKey } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const issue = await client.issues.getIssue({
        issueIdOrKey: issueKey,
        fields: ['attachment'],
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueKey, attachments: issue.fields?.attachment || [] }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get attachments: ${error.message}`);
    }
  }

  private async getWorklogs(args: { workspaceName: string; issueKey: string; startAt?: number; maxResults?: number }, userId?: string) {
    try {
      const { workspaceName, issueKey } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      // Use API call as getWorklog doesn't support pagination directly
      return await this.apiCall({
        workspaceName,
        service: 'issueWorklogs',
        method: 'getWorklog',
        parameters: {
          issueIdOrKey: issueKey,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to get worklogs: ${error.message}`);
    }
  }

  private async addWorklog(args: { workspaceName: string; issueKey: string; timeSpent: string; comment?: string; started?: string }, userId?: string) {
    try {
      const { workspaceName, issueKey, timeSpent, comment, started } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const worklog = await client.issueWorklogs.addWorklog({
        issueIdOrKey: issueKey,
        timeSpent,
        comment: comment || undefined,
        started: started ? new Date(started).toISOString() : undefined,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueKey, worklog }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to add worklog: ${error.message}`);
    }
  }

  private async searchUsers(args: { workspaceName: string; query: string; startAt?: number; maxResults?: number }, userId?: string) {
    try {
      const { workspaceName, query, maxResults = 50 } = args;
      // Use API call for user search
      return await this.apiCall({
        workspaceName,
        service: 'users',
        method: 'findUsersForPicker',
        parameters: {
          query,
          maxResults,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  private async getUser(args: { workspaceName: string; accountId: string; expand?: string[] }, userId?: string) {
    try {
      const { workspaceName, accountId, expand } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const user = await client.users.getUser({
        accountId,
        expand,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, accountId, user }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  private async getCurrentUser(args: { workspaceName: string; expand?: string[] }, userId?: string) {
    try {
      const { workspaceName, expand } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const user = await client.myself.getCurrentUser({ expand });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, user }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }
  }

  private async searchProjects(args: { workspaceName: string; query?: string; keys?: string[]; startAt?: number; maxResults?: number }, userId?: string) {
    try {
      const { workspaceName, query, keys, startAt = 0, maxResults = 50 } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const projects = await client.projects.searchProjects({
        query,
        keys,
        startAt,
        maxResults,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, projects }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to search projects: ${error.message}`);
    }
  }

  private async getProjectComponents(args: { workspaceName: string; projectKeyOrId: string }, userId?: string) {
    try {
      const { workspaceName, projectKeyOrId } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const components = await client.projectComponents.getProjectComponents({
        projectIdOrKey: projectKeyOrId,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, projectKeyOrId, components }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get project components: ${error.message}`);
    }
  }

  private async getProjectVersions(args: { workspaceName: string; projectKeyOrId: string }, userId?: string) {
    try {
      const { workspaceName, projectKeyOrId } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const versions = await client.projectVersions.getProjectVersions({
        projectIdOrKey: projectKeyOrId,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, projectKeyOrId, versions }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get project versions: ${error.message}`);
    }
  }

  private async getFields(args: { workspaceName: string }, userId?: string) {
    try {
      const { workspaceName } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const fields = await client.issueFields.getFields();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, fields }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get fields: ${error.message}`);
    }
  }

  private async getPriorities(args: { workspaceName: string }, userId?: string) {
    try {
      const { workspaceName } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const priorities = await client.issuePriorities.getPriorities();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, priorities }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get priorities: ${error.message}`);
    }
  }

  private async getResolutions(args: { workspaceName: string }, userId?: string) {
    try {
      const { workspaceName } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const resolutions = await client.issueResolutions.getResolutions();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, resolutions }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get resolutions: ${error.message}`);
    }
  }

  private async getStatuses(args: { workspaceName: string }, userId?: string) {
    try {
      const { workspaceName } = args;
      // Statuses are accessed via the status API
      return await this.apiCall({
        workspaceName,
        service: 'status',
        method: 'getStatuses',
        parameters: {},
      });
    } catch (error: any) {
      throw new Error(`Failed to get statuses: ${error.message}`);
    }
  }

  private async getIssueTypes(args: { workspaceName: string }, userId?: string) {
    try {
      const { workspaceName } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const issueTypes = await client.issueTypes.getIssueAllTypes();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, issueTypes }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get issue types: ${error.message}`);
    }
  }

  private async getBoards(args: { workspaceName: string; startAt?: number; maxResults?: number }, userId?: string) {
    try {
      const { workspaceName, startAt = 0, maxResults = 50 } = args;
      // Boards are in the agile API, use api_call
      return await this.apiCall({
        workspaceName,
        service: 'agile',
        method: 'getAllBoards',
        parameters: {
          startAt,
          maxResults,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to get boards: ${error.message}`);
    }
  }

  private async getBoard(args: { workspaceName: string; boardId: number }, userId?: string) {
    try {
      const { workspaceName, boardId } = args;
      // Boards are in the agile API, use api_call
      return await this.apiCall({
        workspaceName,
        service: 'agile',
        method: 'getBoard',
        parameters: {
          boardId,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to get board: ${error.message}`);
    }
  }

  private async getSprints(args: { workspaceName: string; boardId: number; startAt?: number; maxResults?: number }, userId?: string) {
    try {
      const { workspaceName, boardId, startAt = 0, maxResults = 50 } = args;
      // Boards/Sprints are in the agile API, use api_call
      return await this.apiCall({
        workspaceName,
        service: 'agile',
        method: 'getAllSprints',
        parameters: {
          boardId,
          startAt,
          maxResults,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to get sprints: ${error.message}`);
    }
  }

  private async getFilters(args: { workspaceName: string; expand?: string }, userId?: string) {
    try {
      const { workspaceName, expand } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      const filters = await client.filters.getFavouriteFilters({ expand });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, filters }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get filters: ${error.message}`);
    }
  }

  private async apiCall(args: { workspaceName: string; service: string; method: string; parameters?: any }, userId?: string) {
    try {
      const { workspaceName, service, method, parameters = {} } = args;
        const client = await this.workspaceManager.getJiraClient(workspaceName, userId);
      
      // Access the service dynamically
      const serviceObj = (client as any)[service];
      if (!serviceObj) {
        throw new Error(`Service "${service}" not found`);
      }

      const methodFunc = serviceObj[method];
      if (!methodFunc || typeof methodFunc !== 'function') {
        throw new Error(`Method "${method}" not found on service "${service}"`);
      }

      const result = await methodFunc.call(serviceObj, parameters);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, service, method, parameters, result }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }
}

