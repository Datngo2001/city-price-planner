# Use the official Golang Bullseye image as a base image
FROM golang:tip-bullseye

# Set the working directory inside the container
WORKDIR /app

# Install necessary build tools
RUN apt-get update && apt-get install -y git

# Copy go.mod and go.sum files first to leverage Docker layer caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
