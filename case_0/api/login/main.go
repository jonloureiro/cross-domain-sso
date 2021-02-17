package main

import (
	"encoding/json"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/jonloureiro/cross-domain-sso/case_0/api"
	"golang.org/x/crypto/bcrypt"
)

type requestBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod != "POST" {
		return api.HandlerNotAllowed(request)
	}

	body := requestBody{}
	err := json.Unmarshal([]byte(request.Body), &body)

	if err != nil {
		return nil, err
	}

	if body.Username == os.Getenv("USERNAME") {
		err = bcrypt.CompareHashAndPassword([]byte(os.Getenv("PASSWORD")), []byte(body.Password))
	} else {
		return api.HandlerForbidden(request)
	}
	if err != nil {
		return api.HandlerForbidden(request)
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       body.Username,
	}, nil
}

func main() {
	lambda.Start(handler)
}
