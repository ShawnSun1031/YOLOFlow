from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# --- Dataset Schemas ---
class DatasetBase(BaseModel):
    name: str
    path: str
    url: Optional[str] = None
    type: str  # e.g. 'yolo', 'coco'
    description: Optional[str] = None
    tags: List[str] = []


class DatasetCreate(DatasetBase):
    pass  # In real app, might handle file upload metadata here


class Dataset(DatasetBase):
    id: str
    created_at: datetime
    images_metadata: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True


# --- Training Schemas ---
class TrainingBase(BaseModel):
    hyperparameters: Dict[str, Any]


class TrainingCreate(TrainingBase):
    pass


class Training(TrainingBase):
    id: str
    status: str
    mlflow_run_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Model Schemas ---
class ModelBase(BaseModel):
    name: str
    path: str
    metrics: Optional[Dict[str, Any]] = None


class Model(ModelBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Flow Schemas ---
class FlowBase(BaseModel):
    name: Optional[str] = None
    status: str = "draft"


class FlowCreate(FlowBase):
    dataset_id: Optional[str] = None
    training_id: Optional[str] = None
    model_id: Optional[str] = None


class Flow(FlowBase):
    id: str
    created_at: datetime
    dataset: Optional[Dataset] = None
    training: Optional[Training] = None
    model: Optional[Model] = None

    class Config:
        from_attributes = True
