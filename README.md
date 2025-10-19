# Project Setup

A full-stack application with Laravel backend and Angular frontend, containerized with Docker.

## Prerequisites

Make sure you have these installed on your machine:
- Docker
- Docker Compose
- Make (optional, but recommended)

## Quick Start

**First time setup only** - run these commands:

```bash
make build
make up
make init
```

This will:
- Build the Docker containers
- Start up all the containers
- Copy the environment configuration
- Generate the application key
- Create the SQLite database
- Run database migrations

Once that's done, you can access the application at:
- http://localhost

**For all subsequent runs**, just use:
```bash
make up
```

## Available Commands

The Makefile includes several helpful commands:

```bash
make init           # First time setup (run once)
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
