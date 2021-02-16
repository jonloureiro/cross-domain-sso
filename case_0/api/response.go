package api

// Response doc
type Response struct {
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers"`
	Body       ResponseBody      `json:"body"`
}

// ResponseBody doc
type ResponseBody struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
