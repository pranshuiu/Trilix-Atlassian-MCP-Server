package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// ClerkAuth handles Clerk authentication
type ClerkAuth struct {
	secretKey string
}

// NewClerkAuth creates a new Clerk auth handler
func NewClerkAuth() *ClerkAuth {
	secretKey := os.Getenv("CLERK_SECRET_KEY")
	if secretKey == "" {
		return nil
	}

	return &ClerkAuth{
		secretKey: secretKey,
	}
}

// UserContext represents authenticated user information
type UserContext struct {
	UserID string
	Email  string
}

// VerifyToken verifies a Clerk session token
func (c *ClerkAuth) VerifyToken(token string) (*UserContext, error) {
	if c == nil {
		return nil, fmt.Errorf("Clerk authentication not configured")
	}

	// Call Clerk API to verify token
	url := fmt.Sprintf("https://api.clerk.dev/v1/sessions/%s/verify", token)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.secretKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("token verification failed")
	}

	var result struct {
		UserID string `json:"user_id"`
		Email  string `json:"email"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &UserContext{
		UserID: result.UserID,
		Email:  result.Email,
	}, nil
}

// ExtractUserID extracts user ID from request metadata
func ExtractUserID(metadata map[string]interface{}) string {
	if metadata == nil {
		return ""
	}

	// Try clerkToken first
	if clerkToken, ok := metadata["clerkToken"].(string); ok && clerkToken != "" {
		auth := NewClerkAuth()
		if auth != nil {
			ctx, err := auth.VerifyToken(clerkToken)
			if err == nil {
				return ctx.UserID
			}
		}
	}

	// Fall back to userId
	if userID, ok := metadata["userId"].(string); ok {
		return userID
	}

	return ""
}

