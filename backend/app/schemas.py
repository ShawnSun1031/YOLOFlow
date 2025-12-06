from datetime import datetime
from typing import Any

from pydantic import BaseModel


# --- Dataset Schemas ---
class DatasetBase(BaseModel):
    name: str
    path: str
    url: str | None = None
    type: str  # e.g. 'yolo', 'coco'
    description: str | None = None
    tags: list[str] = []


class DatasetCreate(DatasetBase):
    pass  # In real app, might handle file upload metadata here


class Dataset(DatasetBase):
    id: str
    created_at: datetime
    images_metadata: list[dict[str, Any]] = []

    class Config:
        from_attributes = True


# --- Training Schemas ---
class TrainingBase(BaseModel):
    hyperparameters: dict[str, Any]


class TrainingCreate(TrainingBase):
    pass


class Training(TrainingBase):
    id: str
    status: str
    mlflow_run_id: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Model Schemas ---
class ModelBase(BaseModel):
    name: str
    path: str
    metrics: dict[str, Any] | None = None


class Model(ModelBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Flow Schemas ---
class FlowBase(BaseModel):
    name: str | None = None
    status: str = "draft"


class FlowCreate(FlowBase):
    dataset_id: str | None = None
    training_id: str | None = None
    model_id: str | None = None


class Flow(FlowBase):
    id: str
    created_at: datetime
    dataset: Dataset | None = None
    training: Training | None = None
    model: Model | None = None

    class Config:
        from_attributes = True
