# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

# Install the project into `/app`
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=/backend/uv.lock,target=uv.lock \
    --mount=type=bind,source=/backend/pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Add the rest of the source code
COPY backend /app/backend
COPY frontend /app/frontend

# Install the project
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=/backend/uv.lock,target=uv.lock \
    --mount=type=bind,source=/backend/pyproject.toml,target=pyproject.toml \
    uv sync --locked

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Run the FastAPI app by default
# Uses `fastapi run` which is included in the dependencies (fastapi-cli) or uvicorn
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
