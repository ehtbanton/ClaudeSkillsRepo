# ===========================================
# Makefile: Node.js/TypeScript Project
# ===========================================

.PHONY: all install dev build start test lint format clean docker-build docker-up docker-down help

# Default target
all: help

# ===========================================
# Variables
# ===========================================
APP_NAME := myapp
VERSION := $(shell node -p "require('./package.json').version")
NODE_ENV ?= development
DOCKER_REGISTRY ?= ghcr.io
DOCKER_IMAGE := $(DOCKER_REGISTRY)/$(APP_NAME)

# Colors for terminal output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# ===========================================
# Development
# ===========================================

## Install dependencies
install:
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install

## Start development server with hot reload
dev:
	@echo "$(GREEN)Starting development server...$(NC)"
	pnpm dev

## Build for production
build:
	@echo "$(BLUE)Building for production...$(NC)"
	pnpm build
	@echo "$(GREEN)Build complete!$(NC)"

## Start production server
start:
	@echo "$(GREEN)Starting production server...$(NC)"
	NODE_ENV=production node dist/index.js

# ===========================================
# Testing
# ===========================================

## Run all tests
test:
	@echo "$(BLUE)Running tests...$(NC)"
	pnpm test

## Run tests with coverage
test-coverage:
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	pnpm test:coverage

## Run tests in watch mode
test-watch:
	@echo "$(BLUE)Running tests in watch mode...$(NC)"
	pnpm test -- --watch

# ===========================================
# Code Quality
# ===========================================

## Run linter
lint:
	@echo "$(BLUE)Running ESLint...$(NC)"
	pnpm lint

## Fix linting issues
lint-fix:
	@echo "$(BLUE)Fixing lint issues...$(NC)"
	pnpm lint:fix

## Format code with Prettier
format:
	@echo "$(BLUE)Formatting code...$(NC)"
	pnpm format

## Type check
typecheck:
	@echo "$(BLUE)Running TypeScript type check...$(NC)"
	pnpm typecheck

## Run all checks (lint, typecheck, test)
check: lint typecheck test
	@echo "$(GREEN)All checks passed!$(NC)"

# ===========================================
# Database
# ===========================================

## Run database migrations
db-migrate:
	@echo "$(BLUE)Running database migrations...$(NC)"
	pnpm prisma migrate dev

## Generate Prisma client
db-generate:
	@echo "$(BLUE)Generating Prisma client...$(NC)"
	pnpm prisma generate

## Push schema to database
db-push:
	@echo "$(BLUE)Pushing schema to database...$(NC)"
	pnpm prisma db push

## Seed database
db-seed:
	@echo "$(BLUE)Seeding database...$(NC)"
	pnpm prisma db seed

## Open Prisma Studio
db-studio:
	@echo "$(BLUE)Opening Prisma Studio...$(NC)"
	pnpm prisma studio

## Reset database (WARNING: destroys data)
db-reset:
	@echo "$(RED)Resetting database...$(NC)"
	pnpm prisma migrate reset

# ===========================================
# Docker
# ===========================================

## Build Docker image
docker-build:
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t $(DOCKER_IMAGE):$(VERSION) -t $(DOCKER_IMAGE):latest .

## Start Docker containers
docker-up:
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	docker-compose up -d

## Stop Docker containers
docker-down:
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose down

## View Docker logs
docker-logs:
	docker-compose logs -f

## Push Docker image to registry
docker-push:
	@echo "$(BLUE)Pushing Docker image...$(NC)"
	docker push $(DOCKER_IMAGE):$(VERSION)
	docker push $(DOCKER_IMAGE):latest

## Clean Docker resources
docker-clean:
	@echo "$(YELLOW)Cleaning Docker resources...$(NC)"
	docker-compose down -v --rmi local

# ===========================================
# Utilities
# ===========================================

## Clean build artifacts
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf dist coverage .next .nuxt node_modules/.cache
	@echo "$(GREEN)Clean complete!$(NC)"

## Deep clean (including node_modules)
clean-all: clean
	@echo "$(YELLOW)Removing node_modules...$(NC)"
	rm -rf node_modules
	@echo "$(GREEN)Deep clean complete!$(NC)"

## Show project info
info:
	@echo "$(BLUE)Project Information$(NC)"
	@echo "Name: $(APP_NAME)"
	@echo "Version: $(VERSION)"
	@echo "Node: $(shell node --version)"
	@echo "npm: $(shell npm --version)"
	@echo "pnpm: $(shell pnpm --version)"

# ===========================================
# Help
# ===========================================

## Show this help message
help:
	@echo "$(BLUE)$(APP_NAME) - Available Commands$(NC)"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## //' | while read line; do \
		target=$$(echo "$$line" | head -1); \
		echo "  $(GREEN)make $$(grep -B1 "^## $$target$$" $(MAKEFILE_LIST) | head -1 | cut -d: -f1)$(NC)"; \
		echo "    $$target"; \
		echo ""; \
	done
	@echo ""
	@echo "$(YELLOW)Usage:$(NC) make [target]"
