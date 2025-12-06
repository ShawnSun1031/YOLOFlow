format-frontend:
	cd frontend \
	&& pnpm run format

lint-frontend:
	cd frontend \
	&& pnpm run lint

lint-backend:
	cd backend \
	&& uv run ruff check .

format-backend:
	cd backend \
	&& uv run ruff check --fix . \
	&& uv run ruff format .

lint: lint-frontend lint-backend

format: format-frontend format-backend