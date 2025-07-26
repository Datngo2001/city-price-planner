# Use the official Golang Bullseye image as a base image
FROM golang:tip-bullseye

# Set the working directory inside the container
WORKDIR /app

# Install necessary build tools and Delve debugger
RUN apt-get update && apt-get install -y git && \
    go install github.com/go-delve/delve/cmd/dlv@latest

# Copy go.mod and go.sum files first to leverage Docker layer caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application with debugging information
RUN go build -gcflags="all=-N -l" -o main .

# Expose the application port and debug port
EXPOSE 8080 2345

# Command to run Delve in debug mode
CMD ["dlv", "debug", "--headless", "--listen=:2345", "--api-version=2", "--accept-multiclient", "--continue", "./main.go"]
