# Project Setup

A full-stack application with Laravel backend and Angular frontend, containerized with Docker.

## Prerequisites

Make sure you have these installed on your machine:
- Docker
- Docker Compose
- Make (optional, but recommended)

## Quick Start

If this is your first time setting up the project, just run:

```bash
make start
```

This will:
- Start up all the containers
- Copy the environment configuration
- Generate the application key
- Create the SQLite database
- Install all backend dependencies
- Run database migrations

Once that's done, you can access the application at:
- http://localhost

For subsequent starts, just use:
```bash
make up
```

## Available Commands

The Makefile includes several helpful commands:

```bash
make start          # Start containers and run full setup
make build          # Build Docker containers
make up             # Start containers only
make down           # Stop containers
make backend-shell  # Open a shell in the backend container
make frontend-shell # Open a shell in the frontend container
make install        # Install backend dependencies
make migrate        # Run database migrations
make fresh          # Fresh migration (WARNING: drops all tables)
make cache-clear    # Clear all Laravel caches
```

## Tech Stack

- **Backend**: Laravel (PHP)
- **Frontend**: Angular
- **Database**: SQLite
- **Web Server**: Nginx
- **Container**: Docker
