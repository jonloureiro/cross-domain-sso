package api

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

// HandlerForbidden doc
func HandlerForbidden(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	code := http.StatusForbidden
	message := http.StatusText(code)

	resBody, err := json.Marshal(responseBody{
		Code:    code,
		Message: message,
	})

	if err != nil {
		return nil, err
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: code,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(resBody),
	}, nil
}
