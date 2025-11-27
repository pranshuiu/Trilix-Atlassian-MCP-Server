package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/providentiaww/trilix-atlassian-mcp/internal/models"
)

// CredentialStoreInterface defines the interface for credential storage
type CredentialStoreInterface interface {
	GetCredentials(userID, workspaceID string) (*models.WorkspaceCredentials, error)
	SaveCredentials(cred *models.AtlassianCredential) error
	DeleteCredentials(userID, workspaceID string) error
	ListWorkspaces(userID string) ([]models.AtlassianCredential, error)
	Close() error
}

// WorkspaceConfig represents the structure of workspaces.json
type WorkspaceConfig struct {
	Name     string `json:"name"`
	BaseURL  string `json:"baseUrl"`
	Email    string `json:"email"`
	APIToken string `json:"apiToken"`
}

// FileCredentialStore handles storage and retrieval of Atlassian credentials from a JSON file
type FileCredentialStore struct {
	filePath string
	workspaces map[string]WorkspaceConfig
}

// NewFileCredentialStore creates a new file-based credential store
func NewFileCredentialStore(filePath string) (*FileCredentialStore, error) {
	store := &FileCredentialStore{
		filePath:   filePath,
		workspaces: make(map[string]WorkspaceConfig),
	}

	// Load workspaces from file
	if err := store.loadWorkspaces(); err != nil {
		return nil, fmt.Errorf("failed to load workspaces: %w", err)
	}

	return store, nil
}

// loadWorkspaces reads and parses the workspaces.json file
func (s *FileCredentialStore) loadWorkspaces() error {
	// Resolve absolute path
	absPath, err := filepath.Abs(s.filePath)
	if err != nil {
		return err
	}

	// Read file
	data, err := os.ReadFile(absPath)
	if err != nil {
		return fmt.Errorf("failed to read workspaces file: %w", err)
	}

	// Parse JSON
	var workspaces []WorkspaceConfig
	if err := json.Unmarshal(data, &workspaces); err != nil {
		return fmt.Errorf("failed to parse workspaces JSON: %w", err)
	}

	// Index by name (workspace ID)
	for _, ws := range workspaces {
		s.workspaces[ws.Name] = ws
	}

	return nil
}

// GetCredentials retrieves credentials for a user/workspace
// Note: userID is ignored in file-based storage as it's designed for single-user local development
func (s *FileCredentialStore) GetCredentials(userID, workspaceID string) (*models.WorkspaceCredentials, error) {
	ws, exists := s.workspaces[workspaceID]
	if !exists {
		return nil, ErrNotFound
	}

	return &models.WorkspaceCredentials{
		Site:  ws.BaseURL,
		Email: ws.Email,
		Token: ws.APIToken,
	}, nil
}

// SaveCredentials is a no-op for file-based storage (read-only)
func (s *FileCredentialStore) SaveCredentials(cred *models.AtlassianCredential) error {
	return fmt.Errorf("file-based credential store is read-only")
}

// DeleteCredentials is a no-op for file-based storage (read-only)
func (s *FileCredentialStore) DeleteCredentials(userID, workspaceID string) error {
	return fmt.Errorf("file-based credential store is read-only")
}

// ListWorkspaces returns all workspaces from the file
func (s *FileCredentialStore) ListWorkspaces(userID string) ([]models.AtlassianCredential, error) {
	var credentials []models.AtlassianCredential
	for name, ws := range s.workspaces {
		credentials = append(credentials, models.AtlassianCredential{
			UserID:        userID, // Use provided userID or empty string
			WorkspaceID:   name,
			WorkspaceName: name,
			AtlassianURL: ws.BaseURL,
			Email:         ws.Email,
			APIToken:      "", // Don't expose token in list
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		})
	}
	return credentials, nil
}

// Close is a no-op for file-based storage
func (s *FileCredentialStore) Close() error {
	return nil
}

// NewCredentialStoreFromEnv creates a credential store based on environment variables
// If WORKSPACES_FILE is set, uses file-based storage
// Otherwise, uses PostgreSQL storage (requires DATABASE_URL and API_KEY_ENCRYPTION_KEY)
func NewCredentialStoreFromEnv() (CredentialStoreInterface, error) {
	workspacesFile := os.Getenv("WORKSPACES_FILE")
	if workspacesFile != "" {
		// Use file-based storage
		return NewFileCredentialStore(workspacesFile)
	}

	// Use PostgreSQL storage
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return nil, fmt.Errorf("either WORKSPACES_FILE or DATABASE_URL must be set")
	}

	encryptionKey := os.Getenv("API_KEY_ENCRYPTION_KEY")
	if encryptionKey == "" {
		return nil, fmt.Errorf("API_KEY_ENCRYPTION_KEY is required when using database storage")
	}

	return NewCredentialStore(databaseURL, encryptionKey)
}

