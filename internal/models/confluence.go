package models

// ConfluenceRequest represents a request to the Confluence service
type ConfluenceRequest struct {
	Action      string         `json:"action"`       // get_page, search, create_page, update_page, list_spaces, copy_page
	WorkspaceID string         `json:"workspace_id"` // User's workspace label (e.g., "eso", "providentia")
	UserID      string         `json:"user_id"`      // Clerk user ID
	Params      map[string]any `json:"params"`       // Action-specific parameters
	RequestID   string         `json:"request_id"`   // Correlation ID for tracing
}

// ConfluenceResponse represents a response from the Confluence service
type ConfluenceResponse struct {
	Success   bool      `json:"success"`
	Data      any       `json:"data,omitempty"`
	Error     *ErrorInfo `json:"error,omitempty"`
	RequestID string    `json:"request_id"`
}

// ConfluencePage represents a Confluence page
type ConfluencePage struct {
	ID      string       `json:"id"`
	Title   string       `json:"title"`
	Version VersionInfo  `json:"version"`
	Body    PageBody     `json:"body"`
	Space   SpaceRef     `json:"space,omitempty"`
	Links   PageLinks    `json:"_links,omitempty"`
}

// PageBody contains the page content
type PageBody struct {
	Storage StorageContent `json:"storage"`
}

// StorageContent represents the storage format content
type StorageContent struct {
	Value          string `json:"value"`
	Representation string `json:"representation"`
}

// VersionInfo contains version information
type VersionInfo struct {
	Number int `json:"number"`
}

// SpaceRef references a Confluence space
type SpaceRef struct {
	Key  string `json:"key"`
	Name string `json:"name,omitempty"`
	ID   string `json:"id,omitempty"`
}

// PageLinks contains navigation links
type PageLinks struct {
	WebUI string `json:"webui,omitempty"`
}

// CreatePageRequest represents a request to create a page
type CreatePageRequest struct {
	Type      string        `json:"type"`
	Title     string        `json:"title"`
	Space     SpaceRef      `json:"space"`
	Body      BodyContent   `json:"body"`
	Ancestors []AncestorRef `json:"ancestors,omitempty"`
}

// BodyContent wraps the storage content
type BodyContent struct {
	Storage StorageContent `json:"storage"`
}

// AncestorRef references a parent page
type AncestorRef struct {
	ID string `json:"id"`
}

// ConfluenceSpace represents a Confluence space
type ConfluenceSpace struct {
	ID          int    `json:"id"`
	Key         string `json:"key"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description,omitempty"`
}

// SearchResults represents Confluence search results
type SearchResults struct {
	Results []ConfluencePage `json:"results"`
	Size    int              `json:"size"`
	Limit   int              `json:"limit"`
	Start   int              `json:"start"`
}

