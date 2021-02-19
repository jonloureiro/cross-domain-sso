package main

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func setenv() {
	os.Setenv("USERNAME", "example")
	os.Setenv("PASSWORD", "$2y$04$SzoERJH2.DbxFokFWSC45uViko3t2JQflQY0PfjanGUYkVbayg/2W ")
}

func assert(t *testing.T, test interface{}, result interface{}, err error) {
	if err != nil {
		t.Error(err)
	}

	if result != test {
		t.Error("Expected:", result, "Got:", test)
	}
}

func TestHandler0(t *testing.T) {
	test, err := handler(events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
	})
	result := events.APIGatewayProxyResponse{
		StatusCode: 405,
	}
	assert(t, test.StatusCode, result.StatusCode, err)
}

func TestHandler1(t *testing.T) {
	setenv()
	reqBody, _ := json.Marshal(requestBody{"exampl", "1"})
	test, err := handler(events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       string(reqBody),
	})
	result := events.APIGatewayProxyResponse{
		StatusCode: 403,
	}
	assert(t, test.StatusCode, result.StatusCode, err)

	reqBody, _ = json.Marshal(requestBody{"example", "2"})
	test, err = handler(events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       string(reqBody),
	})
	result = events.APIGatewayProxyResponse{
		StatusCode: 403,
	}
	assert(t, test.StatusCode, result.StatusCode, err)
}

func TestHandler2(t *testing.T) {
	setenv()
	reqBody, _ := json.Marshal(requestBody{"example", "1"})
	test, err := handler(events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       string(reqBody),
	})
	result := events.APIGatewayProxyResponse{
		StatusCode: 200,
	}

	assert(t, test.StatusCode, result.StatusCode, err)
}
