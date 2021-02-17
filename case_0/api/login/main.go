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

type response struct {
	Token string `json:"token"`
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

	if body.Username != os.Getenv("USERNAME") {
		return api.HandlerForbidden(request)
	}

	err = bcrypt.CompareHashAndPassword([]byte(os.Getenv("PASSWORD")), []byte(body.Password))
	if err != nil {
		return api.HandlerForbidden(request)
	}

	responseBody, err := json.Marshal(response{"tokentokentoken"})

	if err != nil {
		return nil, err
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}

func main() {
	lambda.Start(handler)
}
