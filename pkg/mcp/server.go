package mcp

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
)

// Server handles MCP protocol communication over stdio
type Server struct {
	tools []Tool
}

// NewServer creates a new MCP server
func NewServer() *Server {
	return &Server{
		tools: []Tool{},
	}
}

// RegisterTool registers a tool with the server
func (s *Server) RegisterTool(tool Tool) {
	s.tools = append(s.tools, tool)
}

// Start starts the MCP server on stdio
func (s *Server) Start(handler func(ToolCall) (ToolResult, error)) error {
	scanner := bufio.NewScanner(os.Stdin)
	writer := os.Stdout

	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}

		var request map[string]interface{}
		if err := json.Unmarshal(line, &request); err != nil {
			continue
		}

		method, ok := request["method"].(string)
		if !ok {
			continue
		}

		var response map[string]interface{}

		switch method {
		case "initialize":
			response = s.handleInitialize(request)
		case "tools/list":
			response = s.handleListTools()
		case "tools/call":
			response = s.handleToolCall(request, handler)
		default:
			response = map[string]interface{}{
				"error": map[string]string{
					"code":    "-32601",
					"message": fmt.Sprintf("Method not found: %s", method),
				},
			}
		}

		response["jsonrpc"] = "2.0"
		if id, ok := request["id"]; ok {
			response["id"] = id
		}

		responseBytes, _ := json.Marshal(response)
		writer.Write(responseBytes)
		writer.WriteString("\n")
		writer.Sync()
	}

	return scanner.Err()
}

func (s *Server) handleInitialize(request map[string]interface{}) map[string]interface{} {
	return map[string]interface{}{
		"result": map[string]interface{}{
			"protocolVersion": "2024-11-05",
			"capabilities": map[string]interface{}{
				"tools": map[string]interface{}{},
			},
			"serverInfo": map[string]interface{}{
				"name":    "trilix-atlassian-mcp-server",
				"version": "1.0.0",
			},
		},
	}
}

func (s *Server) handleListTools() map[string]interface{} {
	return map[string]interface{}{
		"result": map[string]interface{}{
			"tools": s.tools,
		},
	}
}

func (s *Server) handleToolCall(request map[string]interface{}, handler func(ToolCall) (ToolResult, error)) map[string]interface{} {
	params, ok := request["params"].(map[string]interface{})
	if !ok {
		return map[string]interface{}{
			"error": map[string]string{
				"code":    "-32602",
				"message": "Invalid params",
			},
		}
	}

	name, _ := params["name"].(string)
	arguments, _ := params["arguments"].(map[string]interface{})

	toolCall := ToolCall{
		Name:      name,
		Arguments: arguments,
	}

	result, err := handler(toolCall)
	if err != nil {
		return map[string]interface{}{
			"error": map[string]string{
				"code":    "-32000",
				"message": err.Error(),
			},
		}
	}

	return map[string]interface{}{
		"result": result,
	}
}

// WriteResponse writes a JSON-RPC response
func WriteResponse(w io.Writer, id interface{}, result interface{}) error {
	response := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      id,
		"result":  result,
	}

	encoder := json.NewEncoder(w)
	return encoder.Encode(response)
}

// WriteError writes a JSON-RPC error response
func WriteError(w io.Writer, id interface{}, code int, message string) error {
	response := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      id,
		"error": map[string]interface{}{
			"code":    code,
			"message": message,
		},
	}

	encoder := json.NewEncoder(w)
	return encoder.Encode(response)
}

