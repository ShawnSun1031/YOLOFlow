# YOLOFlow

End-to-end YOLO training platform scaffolded for FastAPI + MLflow integration.

Quickstart

1. Create virtualenv and install dependencies:

```bash
cd backend
uv sync --locked
. .venv/bin/activate
```

2. (Optional) Start MLflow server locally:

```bash
mlflow server --backend-store-uri sqlite:///mlflow.db --default-artifact-root ./mlruns --host 0.0.0.0 --port 5000
```

3. Run FastAPI backend:

```bash
export MLFLOW_TRACKING_URI=http://localhost:5000
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend (dev):

```bash
cd frontend
pnpm install
pnpm run dev
```

Docker compose (backend + mlflow):

```bash
docker-compose up --build
```

Configuring frontend backend URL

- For Vite dev server, set `VITE_API_URL` when starting the dev server. Example:

```bash
VITE_API_URL=http://localhost:8000 pnpm run dev
```

- Alternatively, when serving the built frontend embed `window.__YOLOFLOW_API_URL__` before the app script in `index.html`:

```html
<script>window.__YOLOFLOW_API_URL__ = 'http://localhost:8000'</script>
<script type="module" src="/src/main.jsx"></script>
```

The frontend reads `VITE_API_URL` first, then `window.__YOLOFLOW_API_URL__`, and falls back to `http://localhost:8000`.

Project structure highlights

- `backend/` — FastAPI app and MLflow/train wrappers
- `requirements.txt` — Python dependencies
- `Dockerfile` — backend container image (example)

Next steps: implement frontend (`frontend/`) and CI/tests.

Docker registry: https://hub.docker.com/r/dicky1031/yoloflow