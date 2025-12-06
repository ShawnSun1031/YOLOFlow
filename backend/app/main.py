from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import stepper, flows

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="YOLOFlow Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stepper.router)
app.include_router(flows.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to YOLOFlow API"}
