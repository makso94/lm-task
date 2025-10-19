build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down


# Commands below require containers to be running

backend-shell:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend bash

frontend-shell:
	@docker compose up -d 2>/dev/null || true
	docker compose exec frontend bash

start:
	docker compose up -d
	docker compose exec backend cp -n /var/www/backend/.env.example /var/www/backend/.env || true
	docker compose exec backend php artisan key:generate
	docker compose exec backend touch /var/www/backend/database/database.sqlite
	docker compose exec backend php artisan migrate

install:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend composer install

migrate:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan migrate

fresh:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan migrate:fresh

cache-clear:
	@docker compose up -d 2>/dev/null || true
	docker compose exec backend php artisan cache:clear
	docker compose exec backend php artisan config:clear
	docker compose exec backend php artisan route:clear
	docker compose exec backend php artisan view:clear
