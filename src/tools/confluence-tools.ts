import { WorkspaceManager } from '../workspace-manager.js';

export class ConfluenceTools {
  constructor(private workspaceManager: WorkspaceManager) {}

  async listTools() {
    return [
      {
        name: 'confluence_search',
        description: 'Search for content in Confluence across all configured workspaces or a specific workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace to search in. If not provided, searches all workspaces.',
            },
            query: {
              type: 'string',
              description: 'Search query string',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'confluence_get_page',
        description: 'Get a specific Confluence page by ID',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            pageId: {
              type: 'string',
              description: 'The ID of the page to retrieve',
            },
          },
          required: ['workspaceName', 'pageId'],
        },
      },
      {
        name: 'confluence_list_spaces',
        description: 'List all spaces in a Confluence workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of spaces to return (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName'],
        },
      },
      {
        name: 'confluence_get_space',
        description: 'Get details about a specific space',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            spaceKey: {
              type: 'string',
              description: 'The key of the space',
            },
          },
          required: ['workspaceName', 'spaceKey'],
        },
      },
      {
        name: 'confluence_list_pages',
        description: 'List pages in a space',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            spaceKey: {
              type: 'string',
              description: 'The key of the space',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of pages to return (default: 20)',
              default: 20,
            },
          },
          required: ['workspaceName', 'spaceKey'],
        },
      },
      {
        name: 'confluence_create_page',
        description: 'Create a new Confluence page',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            spaceKey: {
              type: 'string',
              description: 'The key of the space',
            },
            title: {
              type: 'string',
              description: 'Page title',
            },
            body: {
              type: 'string',
              description: 'Page body content (can be HTML or wiki markup)',
            },
            parentId: {
              type: 'string',
              description: 'Parent page ID (optional)',
            },
            type: {
              type: 'string',
              description: 'Content type (page, blogpost) - default: page',
              default: 'page',
            },
          },
          required: ['workspaceName', 'spaceKey', 'title', 'body'],
        },
      },
      {
        name: 'confluence_update_page',
        description: 'Update an existing Confluence page',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            pageId: {
              type: 'string',
              description: 'The page ID',
            },
            title: {
              type: 'string',
              description: 'Updated page title (optional)',
            },
            body: {
              type: 'string',
              description: 'Updated page body content (optional)',
            },
            version: {
              type: 'number',
              description: 'Current version number (required for update)',
            },
          },
          required: ['workspaceName', 'pageId', 'version'],
        },
      },
      {
        name: 'confluence_delete_page',
        description: 'Delete a Confluence page',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            pageId: {
              type: 'string',
              description: 'The page ID to delete',
            },
          },
          required: ['workspaceName', 'pageId'],
        },
      },
      {
        name: 'confluence_get_attachments',
        description: 'Get attachments for a page',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            pageId: {
              type: 'string',
              description: 'The page ID',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of attachments to return (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName', 'pageId'],
        },
      },
      {
        name: 'confluence_get_comments',
        description: 'Get comments for a page',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            pageId: {
              type: 'string',
              description: 'The page ID',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of comments to return (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName', 'pageId'],
        },
      },
      {
        name: 'confluence_add_comment',
        description: 'Add a comment to a page',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            pageId: {
              type: 'string',
              description: 'The page ID',
            },
            body: {
              type: 'string',
              description: 'Comment body/text',
            },
          },
          required: ['workspaceName', 'pageId', 'body'],
        },
      },
      {
        name: 'confluence_get_labels',
        description: 'Get labels for content',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            contentId: {
              type: 'string',
              description: 'The content ID',
            },
            prefix: {
              type: 'string',
              description: 'Label prefix to filter by (optional)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of labels to return (default: 50)',
              default: 50,
            },
          },
          required: ['workspaceName', 'contentId'],
        },
      },
      {
        name: 'confluence_add_labels',
        description: 'Add labels to content',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            contentId: {
              type: 'string',
              description: 'The content ID',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of label names to add',
            },
          },
          required: ['workspaceName', 'contentId', 'labels'],
        },
      },
      {
        name: 'confluence_get_content_by_type',
        description: 'Get content by type (page, blogpost, comment, attachment)',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            type: {
              type: 'string',
              description: 'Content type (page, blogpost, comment, attachment)',
            },
            spaceKey: {
              type: 'string',
              description: 'Space key to filter by (optional)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 20)',
              default: 20,
            },
          },
          required: ['workspaceName', 'type'],
        },
      },
      {
        name: 'confluence_get_content_history',
        description: 'Get version history for content',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            contentId: {
              type: 'string',
              description: 'The content ID',
            },
          },
          required: ['workspaceName', 'contentId'],
        },
      },
      {
        name: 'confluence_api_call',
        description: 'Make a direct API call to any Confluence endpoint. Use this for advanced operations not covered by specific tools. Service names: content, space, user, group, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceName: {
              type: 'string',
              description: 'Name of the workspace',
            },
            service: {
              type: 'string',
              description: 'Service name (e.g., "content", "space", "user")',
            },
            method: {
              type: 'string',
              description: 'Method name on the service (e.g., "getContentById", "createContent")',
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
      case 'confluence_search':
        return await this.search(args, userId);
      case 'confluence_get_page':
        return await this.getPage(args, userId);
      case 'confluence_list_spaces':
        return await this.listSpaces(args, userId);
      case 'confluence_get_space':
        return await this.getSpace(args, userId);
      case 'confluence_list_pages':
        return await this.listPages(args, userId);
      case 'confluence_create_page':
        return await this.createPage(args, userId);
      case 'confluence_update_page':
        return await this.updatePage(args, userId);
      case 'confluence_delete_page':
        return await this.deletePage(args, userId);
      case 'confluence_get_attachments':
        return await this.getAttachments(args, userId);
      case 'confluence_get_comments':
        return await this.getComments(args, userId);
      case 'confluence_add_comment':
        return await this.addComment(args, userId);
      case 'confluence_get_labels':
        return await this.getLabels(args, userId);
      case 'confluence_add_labels':
        return await this.addLabels(args, userId);
      case 'confluence_get_content_by_type':
        return await this.getContentByType(args, userId);
      case 'confluence_get_content_history':
        return await this.getContentHistory(args, userId);
      case 'confluence_api_call':
        return await this.apiCall(args, userId);
      default:
        throw new Error(`Unknown Confluence tool: ${name}`);
    }
  }

  private async search(args: { workspaceName?: string; query: string; limit?: number }, userId?: string) {
    const { workspaceName, query, limit = 10 } = args;

    try {
      if (workspaceName) {
        const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
        const results = await client.content.searchContentByCQL({
          cql: `text ~ "${query}"`,
          limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  workspace: workspaceName,
                  query,
                  results: results.results,
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
            const client = await this.workspaceManager.getConfluenceClient(workspace.name, userId);
            const results = await client.content.searchContentByCQL({
              cql: `text ~ "${query}"`,
              limit: Math.floor(limit / workspaces.length) || 1,
            });
            allResults.push({
              workspace: workspace.name,
              results: results.results,
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
                  query,
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
      throw new Error(`Confluence search failed: ${error.message}`);
    }
  }

  private async getPage(args: { workspaceName: string; pageId: string }, userId?: string) {
    try {
      const { workspaceName, pageId } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const page = await client.content.getContentById({
        id: pageId,
        expand: ['body.storage', 'space', 'version'],
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                page: {
                  id: page.id,
                  title: page.title,
                  space: page.space,
                  body: page.body,
                  version: page.version,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get Confluence page: ${error.message}`);
    }
  }

  private async listSpaces(args: { workspaceName: string; limit?: number }, userId?: string) {
    try {
      const { workspaceName, limit = 50 } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const spaces = await client.space.getSpaces({
        limit,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                spaces: spaces.results,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to list Confluence spaces: ${error.message}`);
    }
  }

  private async getSpace(args: { workspaceName: string; spaceKey: string }, userId?: string) {
    try {
      const { workspaceName, spaceKey } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const space = await client.space.getSpace({
        spaceKey,
        expand: ['homepage'],
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                space,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get Confluence space: ${error.message}`);
    }
  }

  private async listPages(args: {
    workspaceName: string;
    spaceKey: string;
    limit?: number;
  }, userId?: string) {
    try {
      const { workspaceName, spaceKey, limit = 20 } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const pages = await client.content.getContent({
        spaceKey,
        limit,
        expand: ['space', 'version'],
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                workspace: workspaceName,
                spaceKey,
                pages: pages.results,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to list Confluence pages: ${error.message}`);
    }
  }

  private async createPage(args: {
    workspaceName: string;
    spaceKey: string;
    title: string;
    body: string;
    parentId?: string;
    type?: string;
  }, userId?: string) {
    try {
      const { workspaceName, spaceKey, title, body, parentId, type = 'page' } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const page = await client.content.createContent({
        space: { key: spaceKey },
        type,
        title,
        body: {
          storage: {
            value: body,
            representation: 'storage',
          },
        },
        ancestors: parentId ? [{ id: parentId }] : undefined,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, spaceKey, page }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to create Confluence page: ${error.message}`);
    }
  }

  private async updatePage(args: {
    workspaceName: string;
    pageId: string;
    title?: string;
    body?: string;
    version: number;
  }, userId?: string) {
    try {
      const { workspaceName, pageId, title, body, version } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      
      // Get current page to merge updates
      const currentPage = await client.content.getContentById({ id: pageId });
      
      const updateData: any = {
        id: pageId,
        type: currentPage.type,
        version: { number: version + 1 },
      };

      if (title) updateData.title = title;
      if (body) {
        updateData.body = {
          storage: {
            value: body,
            representation: 'storage',
          },
        };
      }

      const page = await client.content.updateContent(updateData);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, pageId, page }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to update Confluence page: ${error.message}`);
    }
  }

  private async deletePage(args: { workspaceName: string; pageId: string }, userId?: string) {
    try {
      const { workspaceName, pageId } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      await client.content.deleteContent({ id: pageId });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, pageId, message: 'Page deleted successfully' }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to delete Confluence page: ${error.message}`);
    }
  }

  private async getAttachments(args: { workspaceName: string; pageId: string; limit?: number }, userId?: string) {
    try {
      const { workspaceName, pageId, limit = 50 } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const page = await client.content.getContentById({
        id: pageId,
        expand: ['children.attachment'],
      });

      const attachments = (page.children as any)?.attachment?.results || [];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, pageId, attachments: attachments.slice(0, limit) }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get attachments: ${error.message}`);
    }
  }

  private async getComments(args: { workspaceName: string; pageId: string; limit?: number }, userId?: string) {
    try {
      const { workspaceName, pageId, limit = 50 } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const page = await client.content.getContentById({
        id: pageId,
        expand: ['children.comment'],
      });

      const comments = (page.children as any)?.comment?.results || [];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, pageId, comments: comments.slice(0, limit) }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  private async addComment(args: { workspaceName: string; pageId: string; body: string }, userId?: string) {
    try {
      const { workspaceName, pageId, body } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const page = await client.content.getContentById({ id: pageId });
      
      const comment = await client.content.createContent({
        type: 'comment',
        space: { key: (page.space as any).key },
        title: 'Comment',
        body: {
          storage: {
            value: body,
            representation: 'storage',
          },
        },
        ancestors: [{ id: pageId }],
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, pageId, comment }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }

  private async getLabels(args: {
    workspaceName: string;
    contentId: string;
    prefix?: string;
    limit?: number;
  }, userId?: string) {
    try {
      const { workspaceName, contentId, prefix, limit = 50 } = args;
      // Use API call for labels
      return await this.apiCall({
        workspaceName,
        service: 'content',
        method: 'getLabels',
        parameters: {
          id: contentId,
          prefix,
          limit,
        },
      });

    } catch (error: any) {
      throw new Error(`Failed to get labels: ${error.message}`);
    }
  }

  private async addLabels(args: { workspaceName: string; contentId: string; labels: string[] }, userId?: string) {
    try {
      const { workspaceName, contentId, labels } = args;
      // Use API call for adding labels
      return await this.apiCall({
        workspaceName,
        service: 'content',
        method: 'addLabels',
        parameters: {
          id: contentId,
          labels: labels.map((name) => ({ prefix: 'global', name })),
        },
      });

    } catch (error: any) {
      throw new Error(`Failed to add labels: ${error.message}`);
    }
  }

  private async getContentByType(args: {
    workspaceName: string;
    type: string;
    spaceKey?: string;
    limit?: number;
  }, userId?: string) {
    try {
      const { workspaceName, type, spaceKey, limit = 20 } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const content = await client.content.getContent({
        type,
        spaceKey,
        limit,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, type, spaceKey, content: content.results }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get content by type: ${error.message}`);
    }
  }

  private async getContentHistory(args: { workspaceName: string; contentId: string }, userId?: string) {
    try {
      const { workspaceName, contentId } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      const history = await client.content.getHistoryForContent({ id: contentId });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workspace: workspaceName, contentId, history }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get content history: ${error.message}`);
    }
  }

  private async apiCall(args: { workspaceName: string; service: string; method: string; parameters?: any }, userId?: string) {
    try {
      const { workspaceName, service, method, parameters = {} } = args;
      const client = await this.workspaceManager.getConfluenceClient(workspaceName, userId);
      
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

