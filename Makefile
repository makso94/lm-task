.PHONY: help init build up down restart logs shell artisan composer install migrate fresh seed test cache-clear serve dev dev-logs backend-shell frontend-shell

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start both backend and frontend in dev mode (recommended)"
	@echo "  make dev-logs     - View logs from both backend and frontend"
	@echo "  make build        - Build all Docker containers"
	@echo "  make down         - Stop all Docker containers"
	@echo "  make restart      - Restart all Docker containers"
	@echo ""
	@echo "Backend (Laravel):"
	@echo "  make backend-shell - Access backend container shell"
	@echo "  make artisan CMD= - Run artisan command (e.g., make artisan CMD='migrate')"
	@echo "  make composer CMD= - Run composer command (e.g., make composer CMD='require package')"
	@echo "  make install      - Install composer dependencies"
	@echo "  make migrate      - Run database migrations"
	@echo "  make fresh        - Fresh migrate (drop all tables and re-run migrations)"
	@echo "  make seed         - Run database seeders"
	@echo "  make test         - Run tests"
	@echo "  make cache-clear  - Clear all Laravel caches"
	@echo ""
	@echo "Frontend (Angular):"
	@echo "  make frontend-shell - Access frontend container shell"
	@echo ""
	@echo "Legacy:"
	@echo "  make init         - Initialize new Laravel project in backend directory"
	@echo "  make up           - Start the Docker containers"
	@echo "  make logs         - View container logs"
	@echo "  make shell        - Access backend container shell (alias)"
	@echo "  make serve        - Start Laravel development server"

# Development mode - start both backend and frontend
dev:
	@echo "Starting development environment..."
	@echo "Building and starting all containers (nginx, backend, frontend)..."
	docker compose up -d --build
	@echo ""
	@echo "✓ Development environment is running!"
	@echo ""
	@echo "Access your application:"
	@echo "  - Main URL (nginx):   http://localhost"
	@echo "  - Frontend (Angular): http://localhost (proxied via nginx)"
	@echo "  - Backend API:        http://localhost/api (proxied to Laravel)"
	@echo ""
	@echo "Architecture:"
	@echo "  nginx (port 80) -> Frontend (port 4200) + Backend (port 8000)"
	@echo "  All API requests to /api/* are proxied to Laravel backend"
	@echo ""
	@echo "Useful commands:"
	@echo "  make dev-logs        - View logs from all services"
	@echo "  make backend-shell   - Access backend container"
	@echo "  make frontend-shell  - Access frontend container"
	@echo "  make down            - Stop all services"
	@echo ""

# View development logs
dev-logs:
	docker compose logs -f

# Initialize Laravel project
init:
	@echo "Building Docker container..."
	docker compose up -d --build
	@echo "Creating Laravel project in backend directory..."
	docker compose exec backend composer create-project laravel/laravel .
	@echo "Setting up SQLite database..."
	docker compose exec backend touch database/database.sqlite
	docker compose exec backend chmod 775 database/database.sqlite
	@echo "Laravel project created successfully!"
	@echo "Run 'make dev' to start the development environment"

# Build Docker containers
build:
	docker compose build

# Start containers
up:
	docker compose up -d

# Stop containers
down:
	docker compose down

# Restart containers
restart:
	docker compose restart

# View logs
logs:
	docker compose logs -f

# Access backend container shell
backend-shell:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend bash

# Access frontend container shell
frontend-shell:
	@docker compose up -d 2>/dev/null || true
	docker compose exec frontend bash

# Access container shell (legacy - points to backend)
shell:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend bash

# Run artisan command
artisan:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan $(CMD)

# Run composer command
composer:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend composer $(CMD)

# Install dependencies
install:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend composer install

# Run migrations
migrate:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan migrate

# Fresh migrate
fresh:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan migrate:fresh

# Run seeders
seed:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan db:seed

# Run tests
test:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan test

# Clear all caches
cache-clear:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan cache:clear
	docker compose exec backend php artisan config:clear
	docker compose exec backend php artisan route:clear
	docker compose exec backend php artisan view:clear

# Start Laravel development server (legacy - use 'make dev' instead)
serve:
	@docker compose up -d 2>/dev/null || true
	@echo "Starting Laravel development server..."
	docker compose exec backend php artisan serve --host=0.0.0.0 --port=8000
