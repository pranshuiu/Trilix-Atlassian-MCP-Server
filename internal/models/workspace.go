package models

import "time"

// AtlassianCredential represents stored credentials for an Atlassian workspace
type AtlassianCredential struct {
	UserID        string    `json:"user_id"`        // Clerk user ID
	WorkspaceID   string    `json:"workspace_id"`   // User-defined label (e.g., "eso", "providentia")
	WorkspaceName string    `json:"workspace_name"` // Display name
	AtlassianURL string    `json:"atlassian_url"`  // e.g., "https://providentia.atlassian.net"
	Email         string    `json:"email"`          // Atlassian account email
	APIToken      string    `json:"api_token"`     // Encrypted Atlassian API token
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// WorkspaceCredentials is used for API client creation
type WorkspaceCredentials struct {
	Site  string // e.g., "https://eso.atlassian.net/wiki" or "https://eso.atlassian.net"
	Email string // e.g., "service@eso.com"
	Token string // Decrypted API token
}

// ErrorInfo represents error information in responses
type ErrorInfo struct {
	Code    string `json:"code"`    // e.g., "AUTH_FAILED", "NOT_FOUND", "RATE_LIMITED"
	Message string `json:"message"` // Human-readable message
	Details any    `json:"details,omitempty"` // Additional context
}

// Standard error codes
const (
	ErrCodeAuthFailed     = "AUTH_FAILED"
	ErrCodeNotFound       = "NOT_FOUND"
	ErrCodeRateLimited    = "RATE_LIMITED"
	ErrCodeInvalidRequest = "INVALID_REQUEST"
	ErrCodeAPIError       = "API_ERROR"
	ErrCodeInternal       = "INTERNAL_ERROR"
)

// ErrorResponse creates an error response
func ErrorResponse(code, message string, requestID string) map[string]interface{} {
	return map[string]interface{}{
		"success": false,
		"error": &ErrorInfo{
			Code:    code,
			Message: message,
		},
		"request_id": requestID,
	}
}

// SuccessResponse creates a success response
func SuccessResponse(data interface{}, requestID string) map[string]interface{} {
	return map[string]interface{}{
		"success":    true,
		"data":       data,
		"request_id": requestID,
	}
}

