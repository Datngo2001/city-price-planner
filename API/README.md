# City Price Planner API

This is the backend API for the City Price Planner application, built with Go and the Gorilla Mux router.

## Prerequisites

Before you start, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Go extension for VS Code](https://marketplace.visualstudio.com/items?itemName=golang.Go)
- [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

## Project Structure

```
api/
├── Dockerfile          # Docker configuration for the API
├── go.mod              # Go module dependencies
├── go.sum              # Go module checksums
├── main.go             # Main application entry point
└── README.md           # This file
```

## Running the API

### Switching Between Debug and Production Modes

The Docker setup supports both production and debug modes:

#### Production Mode (Normal Mode)
**For regular use without debugging:**

1. **Build the production image:**
   ```powershell
   docker build --target production -t city-price-planner-api:prod ./
   ```

2. **Run the production container:**
   ```powershell
   docker run -p 8080:8080 --name city-price-planner-api-prod city-price-planner-api:prod
   ```

#### Debug Mode
**For development with debugging support:**

1. **Build the debug image:**
   ```powershell
   docker build --target debug -t city-price-planner-api:debug ./
   ```

2. **Run the debug container:**
   ```powershell
   docker run -p 8080:8080 -p 2345:2345 --security-opt="seccomp=unconfined" --name city-price-planner-api-debug city-price-planner-api:debug
   ```

### Option 1: Run with Docker (Recommended)

### Quick Commands Reference

| Mode | Build Command | Run Command |
|------|---------------|-------------|
| **Production** | `docker build --target production -t city-price-planner-api:prod ./` | `docker run -p 8080:8080 --name api-prod city-price-planner-api:prod` |
| **Debug** | `docker build --target debug -t city-price-planner-api:debug ./` | `docker run -p 8080:8080 -p 2345:2345 --security-opt="seccomp=unconfined" --name api-debug city-price-planner-api:debug` |

### Legacy Method (Single Mode)

1. **Build the Docker image (debug mode):**
   ```powershell
   docker build -t city-price-planner-api .
   ```

2. **Run the container:**
   ```powershell
   docker run -p 8080:8080 --name city-price-planner-api city-price-planner-api
   ```

3. **Test the API:**
   Open your browser and navigate to `http://localhost:8080` or use curl:
   ```powershell
   curl http://localhost:8080
   ```

### Option 2: Run Locally (without Docker)

1. **Install dependencies:**
   ```powershell
   go mod download
   ```

2. **Run the application:**
   ```powershell
   go run main.go
   ```

## Debugging with VS Code and Docker

This project is configured for debugging Go applications running inside Docker containers using VS Code.

### Debug Configuration

The project includes a VS Code launch configuration (`.vscode/launch.json`) with two configurations:

1. **Docker: Build** - Builds the Docker image
2. **Docker: Debug Go API** - Attaches the debugger to the containerized application

### How to Debug

1. **Build the debug-enabled Docker image:**
   ```powershell
   docker build --target debug -t city-price-planner-api:debug ./
   ```

2. **Run the container with debugging enabled:**
   ```powershell
   docker run -p 8080:8080 -p 2345:2345 --security-opt="seccomp=unconfined" --name city-price-planner-api-debug city-price-planner-api:debug
   ```

   **Port Explanation:**
   - `8080:8080` - Maps the application port
   - `2345:2345` - Maps the Delve debugger port
   - `--security-opt="seccomp=unconfined"` - Required for the debugger to work properly

3. **Set breakpoints in your code:**
   - Open `main.go` in VS Code
   - Click in the gutter next to line numbers to set breakpoints
   - Example: Set a breakpoint on line 17 in the `HomeHandler` function

4. **Start debugging:**
   - Press `F5` or go to Run and Debug view
   - Select "Docker: Debug Go API" from the dropdown
   - Click the play button or press `F5`

5. **Test the breakpoint:**
   - Open your browser and navigate to `http://localhost:8080`
   - The debugger should stop at your breakpoint
   - You can now inspect variables, step through code, etc.

### Debug Features

When debugging, you can:
- **Set breakpoints** by clicking in the gutter
- **Step through code** using F10 (step over), F11 (step into), Shift+F11 (step out)
- **Inspect variables** in the Variables panel
- **Evaluate expressions** in the Debug Console
- **View call stack** in the Call Stack panel

### Troubleshooting Debug Issues

If debugging doesn't work:

1. **Check if the container is running:**
   ```powershell
   docker ps
   ```

2. **Check container logs:**
   ```powershell
   docker logs city-price-planner-api
   ```

3. **Verify debugger is listening:**
   ```powershell
   docker exec -it city-price-planner-api netstat -tuln | grep 2345
   ```

4. **Restart the debugging session:**
   - Stop the debugger in VS Code
   - Stop and remove the container:
     ```powershell
     docker stop city-price-planner-api
     docker rm city-price-planner-api
     ```
   - Run the container again and restart debugging

## API Endpoints

Currently available endpoints:

- `GET /` - Returns a welcome message

## Docker Configuration Details

The Dockerfile is configured with:
- **Delve debugger** installed for debugging support
- **Debug build flags** (`-gcflags="all=-N -l"`) to disable optimizations
- **Exposed ports** 8080 (app) and 2345 (debugger)
- **Headless debugging** mode for remote debugging

## Stopping the Application

To stop the Docker container:

```powershell
# Stop the container
docker stop city-price-planner-api

# Remove the container (optional)
docker rm city-price-planner-api
```

## Development Workflow

1. Make changes to your Go code
2. Set breakpoints where needed
3. Rebuild the Docker image: `docker build -t city-price-planner-api .`
4. Stop the old container: `docker stop city-price-planner-api && docker rm city-price-planner-api`
5. Run the new container with debugging
6. Start the debugger in VS Code
7. Test your changes

## Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [Gorilla Mux Documentation](https://github.com/gorilla/mux)
- [Delve Debugger Documentation](https://github.com/go-delve/delve)
- [VS Code Go Extension Documentation](https://code.visualstudio.com/docs/languages/go)
