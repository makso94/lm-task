.PHONY: help init build up down restart logs shell artisan composer install migrate fresh seed test cache-clear serve

# Default target
help:
	@echo "Available commands:"
	@echo "  make init         - Initialize new Laravel project in backend directory"
	@echo "  make build        - Build the Docker containers"
	@echo "  make up           - Start the Docker containers"
	@echo "  make down         - Stop the Docker containers"
	@echo "  make restart      - Restart the Docker containers"
	@echo "  make logs         - View container logs"
	@echo "  make shell        - Access container shell"
	@echo "  make serve        - Start Laravel development server"
	@echo "  make artisan CMD= - Run artisan command (e.g., make artisan CMD='migrate')"
	@echo "  make composer CMD= - Run composer command (e.g., make composer CMD='require package')"
	@echo "  make install      - Install composer dependencies"
	@echo "  make migrate      - Run database migrations"
	@echo "  make fresh        - Fresh migrate (drop all tables and re-run migrations)"
	@echo "  make seed         - Run database seeders"
	@echo "  make test         - Run tests"
	@echo "  make cache-clear  - Clear all Laravel caches"

# Initialize Laravel project
init:
	@echo "Building Docker container..."
	docker compose up -d --build
	@echo "Creating Laravel project in backend directory..."
	docker compose exec app composer create-project laravel/laravel .
	@echo "Setting up SQLite database..."
	docker compose exec app touch database/database.sqlite
	docker compose exec app chmod 775 database/database.sqlite
	@echo "Laravel project created successfully!"
	@echo "Run 'make serve' to start the development server"

# Build Docker containers
build:
	docker compose up -d --build

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

# Access container shell
shell:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app bash

# Run artisan command
artisan:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app php artisan $(CMD)

# Run composer command
composer:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app composer $(CMD)

# Install dependencies
install:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app composer install

# Run migrations
migrate:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app php artisan migrate

# Fresh migrate
fresh:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app php artisan migrate:fresh

# Run seeders
seed:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app php artisan db:seed

# Run tests
test:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app php artisan test

# Clear all caches
cache-clear:
	@docker compose up -d 2>/dev/null || true
	docker compose exec app php artisan cache:clear
	docker compose exec app php artisan config:clear
	docker compose exec app php artisan route:clear
	docker compose exec app php artisan view:clear

# Start Laravel development server
serve:
	@docker compose up -d 2>/dev/null || true
	@echo "Starting Laravel development server..."
	docker compose exec app php artisan serve --host=0.0.0.0 --port=8000
