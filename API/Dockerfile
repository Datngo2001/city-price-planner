# Use the official Golang Bullseye image as a base image
FROM golang:tip-bullseye AS builder

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

# Build argument to determine build mode
ARG BUILD_MODE=production

# Build the Go application
RUN if [ "$BUILD_MODE" = "debug" ]; then \
        go build -gcflags="all=-N -l" -o main .; \
    else \
        go build -o main .; \
    fi

# Production stage
FROM golang:tip-bullseye AS production
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]

# Debug stage
FROM golang:tip-bullseye AS debug
WORKDIR /app
COPY --from=builder /go/bin/dlv /usr/local/bin/dlv
COPY --from=builder /app/main .
COPY --from=builder /app .
EXPOSE 8080 2345
CMD ["dlv", "exec", "./main", "--headless", "--listen=:2345", "--api-version=2", "--accept-multiclient", "--continue"]
