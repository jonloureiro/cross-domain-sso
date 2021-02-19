setup:
	go get ./...

test: setup
	go test ./...

build: test
	mkdir -p functions
	go build -o functions/ ./...

clean:
	rm -rf ./functions