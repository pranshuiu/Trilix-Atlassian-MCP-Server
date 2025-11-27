package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/providentiaww/twistygo"
	"github.com/providentiaww/trilix-atlassian-mcp/cmd/mcp-server/auth"
	"github.com/providentiaww/trilix-atlassian-mcp/cmd/mcp-server/handlers"
	"github.com/providentiaww/trilix-atlassian-mcp/internal/models"
	"github.com/providentiaww/trilix-atlassian-mcp/internal/storage"
	"github.com/providentiaww/trilix-atlassian-mcp/pkg/mcp"
	amqp "github.com/rabbitmq/amqp091-go"
)

const ServiceVersion = "v1.0.0"

var rconn *twistygo.AmqpConn_t

func init() {
	// Load environment variables
	godotenv.Load()

	// Initialize TwistyGo
	twistygo.LogStartService("MCPServer", ServiceVersion)
	rconn = twistygo.AmqpConnect()
	rconn.AmqpLoadQueues("ConfluenceRequests", "JiraRequests")
}

func main() {
	// Initialize credential store (file-based or database)
	credStore, err := storage.NewCredentialStoreFromEnv()
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize credential store: %v", err))
	}
	defer credStore.Close()

	// Create service callers
	confluenceCaller := createConfluenceCaller()
	jiraCaller := createJiraCaller()

	// Create handlers
	confluenceHandler := handlers.NewConfluenceHandler(confluenceCaller)
	jiraHandler := handlers.NewJiraHandler(jiraCaller)
	managementHandler := handlers.NewManagementHandler(credStore)

	// Create MCP server
	server := mcp.NewServer()

	// Register all tools
	for _, tool := range confluenceHandler.ListTools() {
		server.RegisterTool(tool)
	}
	for _, tool := range jiraHandler.ListTools() {
		server.RegisterTool(tool)
	}
	for _, tool := range managementHandler.ListTools() {
		server.RegisterTool(tool)
	}

	// Start server with handler
	server.Start(func(call mcp.ToolCall) (mcp.ToolResult, error) {
		// Extract user ID from metadata (if available)
		// For now, use empty string - in production, extract from MCP request
		userID := ""

		// Route to appropriate handler
		if call.Name == "list_workspaces" || call.Name == "workspace_status" {
			return managementHandler.HandleTool(call, userID)
		} else if call.Name[:10] == "confluence_" {
			return confluenceHandler.HandleTool(call, userID)
		} else if call.Name[:5] == "jira_" {
			return jiraHandler.HandleTool(call, userID)
		}

		return mcp.ToolResult{
			Content: []mcp.ContentBlock{
				{Type: "text", Text: fmt.Sprintf("Unknown tool: %s", call.Name)},
			},
			IsError: true,
		}, fmt.Errorf("unknown tool: %s", call.Name)
	})
}

func createConfluenceCaller() func(models.ConfluenceRequest) (*models.ConfluenceResponse, error) {
	return func(req models.ConfluenceRequest) (*models.ConfluenceResponse, error) {
		// Connect to ConfluenceRequests queue
		sq := rconn.AmqpConnectQueue("ConfluenceRequests")
		sq.SetEncoding(twistygo.EncodingJson)

		// Append request data
		sq.Message.AppendData(req)

		// Publish and wait for response (RPC)
		responseBytes, err := sq.Publish()
		if err != nil {
			return nil, err
		}

		// Unmarshal response
		var response models.ConfluenceResponse
		if err := json.Unmarshal(responseBytes, &response); err != nil {
			return nil, err
		}

		return &response, nil
	}
}

func createJiraCaller() func(models.JiraRequest) (*models.JiraResponse, error) {
	return func(req models.JiraRequest) (*models.JiraResponse, error) {
		// Connect to JiraRequests queue
		sq := rconn.AmqpConnectQueue("JiraRequests")
		sq.SetEncoding(twistygo.EncodingJson)

		// Append request data
		sq.Message.AppendData(req)

		// Publish and wait for response (RPC)
		responseBytes, err := sq.Publish()
		if err != nil {
			return nil, err
		}

		// Unmarshal response
		var response models.JiraResponse
		if err := json.Unmarshal(responseBytes, &response); err != nil {
			return nil, err
		}

		return &response, nil
	}
}

