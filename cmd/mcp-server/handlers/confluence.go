package handlers

import (
	"encoding/json"
	"fmt"
	"sync/atomic"

	"github.com/providentiaww/trilix-atlassian-mcp/internal/models"
	"github.com/providentiaww/trilix-atlassian-mcp/pkg/mcp"
)

var requestIDCounter int64

// ConfluenceHandler handles Confluence-related MCP tool calls
type ConfluenceHandler struct {
	callService func(models.ConfluenceRequest) (*models.ConfluenceResponse, error)
}

// NewConfluenceHandler creates a new Confluence handler
func NewConfluenceHandler(callService func(models.ConfluenceRequest) (*models.ConfluenceResponse, error)) *ConfluenceHandler {
	return &ConfluenceHandler{
		callService: callService,
	}
}

// ListTools returns the list of Confluence tools
func (h *ConfluenceHandler) ListTools() []mcp.Tool {
	return []mcp.Tool{
		{
			Name:        "confluence_get_page",
			Description: "Retrieve a Confluence page by ID from a specific workspace",
			InputSchema: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"workspace_id": map[string]interface{}{
						"type":        "string",
						"description": "Workspace ID (e.g., 'eso', 'providentia')",
					},
					"page_id": map[string]interface{}{
						"type":        "string",
						"description": "Confluence page ID",
					},
				},
				"required": []string{"workspace_id", "page_id"},
			},
		},
		{
			Name:        "confluence_search",
			Description: "Search for content in Confluence using CQL",
			InputSchema: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"workspace_id": map[string]interface{}{
						"type":        "string",
						"description": "Workspace ID",
					},
					"query": map[string]interface{}{
						"type":        "string",
						"description": "CQL search query",
					},
					"limit": map[string]interface{}{
						"type":        "number",
						"description": "Maximum number of results",
						"default":     10,
					},
				},
				"required": []string{"workspace_id", "query"},
			},
		},
		{
			Name:        "confluence_create_page",
			Description: "Create a new page in Confluence",
			InputSchema: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"workspace_id": map[string]interface{}{
						"type":        "string",
						"description": "Workspace ID",
					},
					"space_key": map[string]interface{}{
						"type":        "string",
						"description": "Space key",
					},
					"title": map[string]interface{}{
						"type":        "string",
						"description": "Page title",
					},
					"body": map[string]interface{}{
						"type":        "string",
						"description": "Page body (storage format)",
					},
					"parent_id": map[string]interface{}{
						"type":        "string",
						"description": "Optional parent page ID",
					},
				},
				"required": []string{"workspace_id", "space_key", "title", "body"},
			},
		},
		{
			Name:        "confluence_copy_page",
			Description: "Copy a page from one workspace to another",
			InputSchema: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"src_workspace": map[string]interface{}{
						"type":        "string",
						"description": "Source workspace ID",
					},
					"dst_workspace": map[string]interface{}{
						"type":        "string",
						"description": "Destination workspace ID",
					},
					"src_page_id": map[string]interface{}{
						"type":        "string",
						"description": "Source page ID",
					},
					"dst_space_key": map[string]interface{}{
						"type":        "string",
						"description": "Destination space key",
					},
					"dst_parent_id": map[string]interface{}{
						"type":        "string",
						"description": "Optional parent page ID in destination",
					},
				},
				"required": []string{"src_workspace", "dst_workspace", "src_page_id", "dst_space_key"},
			},
		},
		{
			Name:        "confluence_list_spaces",
			Description: "List all spaces in a workspace",
			InputSchema: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"workspace_id": map[string]interface{}{
						"type":        "string",
						"description": "Workspace ID",
					},
					"limit": map[string]interface{}{
						"type":        "number",
						"description": "Maximum number of results",
						"default":     50,
					},
				},
				"required": []string{"workspace_id"},
			},
		},
	}
}

// HandleTool handles a Confluence tool call
func (h *ConfluenceHandler) HandleTool(call mcp.ToolCall, userID string) (mcp.ToolResult, error) {
	workspaceID, ok := call.Arguments["workspace_id"].(string)
	if !ok {
		return mcp.ToolResult{
			Content: []mcp.ContentBlock{
				{Type: "text", Text: "Error: workspace_id is required"},
			},
			IsError: true,
		}, fmt.Errorf("workspace_id is required")
	}

	req := models.ConfluenceRequest{
		Action:      getActionFromToolName(call.Name),
		WorkspaceID: workspaceID,
		UserID:      userID,
		Params:      call.Arguments,
		RequestID:   fmt.Sprintf("req_%d", atomic.AddInt64(&requestIDCounter, 1)),
	}

	resp, err := h.callService(req)
	if err != nil {
		return mcp.ToolResult{
			Content: []mcp.ContentBlock{
				{Type: "text", Text: fmt.Sprintf("Error: %v", err)},
			},
			IsError: true,
		}, err
	}

	if !resp.Success {
		errorMsg := "Unknown error"
		if resp.Error != nil {
			errorMsg = resp.Error.Message
		}
		return mcp.ToolResult{
			Content: []mcp.ContentBlock{
				{Type: "text", Text: fmt.Sprintf("Error: %s", errorMsg)},
			},
			IsError: true,
		}, fmt.Errorf(errorMsg)
	}

	// Convert response to JSON string
	resultJSON, _ := json.MarshalIndent(resp.Data, "", "  ")

	return mcp.ToolResult{
		Content: []mcp.ContentBlock{
			{Type: "text", Text: string(resultJSON)},
		},
	}, nil
}

func getActionFromToolName(toolName string) string {
	switch toolName {
	case "confluence_get_page":
		return "get_page"
	case "confluence_search":
		return "search"
	case "confluence_create_page":
		return "create_page"
	case "confluence_copy_page":
		return "copy_page"
	case "confluence_list_spaces":
		return "list_spaces"
	default:
		return ""
	}
}


