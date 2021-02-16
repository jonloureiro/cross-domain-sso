package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/jonloureiro/cross-domain-sso/case_0/api"
)

func handler(request events.APIGatewayProxyRequest) (*api.Response, error) {
	if request.HTTPMethod != "POST" {
		return api.HandlerNotAllowed(request)
	}

	return &api.Response{
		StatusCode: 200,
		Body:       api.ResponseBody{},
	}, nil
}

func main() {
	lambda.Start(handler)
}
