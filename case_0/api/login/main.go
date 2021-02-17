package main

import (
	"encoding/json"
	"net/http"
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

type responseBody struct {
	Token string `json:"token"`
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod != "POST" {
		return api.HandlerNotAllowed(request)
	}

	reqBody := requestBody{}
	err := json.Unmarshal([]byte(request.Body), &reqBody)
	if err != nil {
		return nil, err
	}

	if reqBody.Username != os.Getenv("USERNAME") {
		return api.HandlerForbidden(request)
	}

	err = bcrypt.CompareHashAndPassword([]byte(os.Getenv("PASSWORD")), []byte(reqBody.Password))
	if err != nil {
		return api.HandlerForbidden(request)
	}

	resBody, err := json.Marshal(responseBody{"tokentokentoken"})

	if err != nil {
		return nil, err
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(resBody),
	}, nil
}

func main() {
	lambda.Start(handler)
}
