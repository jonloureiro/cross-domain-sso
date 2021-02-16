package api

import (
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

// HandlerNotAllowed doc
func HandlerNotAllowed(request events.APIGatewayProxyRequest) (*Response, error) {
	code := http.StatusMethodNotAllowed
	message := http.StatusText(code)
	return &Response{
		StatusCode: code,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body: ResponseBody{
			Code:    code,
			Message: message,
		},
	}, nil
}
