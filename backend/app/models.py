import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from .database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    path = Column(String)
    url = Column(String, nullable=True)
    type = Column(String)  # e.g., 'classification', 'detection'
    description = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Simple JSON structure for image list to mock "database of images"
    # In a real app, this might be a separate table 'Images'
    images_metadata = Column(JSON, default=list)

    flows = relationship("Flow", back_populates="dataset")


class Training(Base):
    __tablename__ = "trainings"

    id = Column(String, primary_key=True, default=generate_uuid)
    hyperparameters = Column(JSON, default=dict)
    status = Column(String, default="pending")  # pending, running, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)

    mlflow_run_id = Column(String, nullable=True)

    flows = relationship("Flow", back_populates="training")


class Model(Base):
    __tablename__ = "models"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    path = Column(String)
    metrics = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    flows = relationship("Flow", back_populates="model")


class Flow(Base):
    __tablename__ = "flows"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=True)
    status = Column(String, default="draft")  # draft, active, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    dataset_id = Column(String, ForeignKey("datasets.id"), nullable=True)
    training_id = Column(String, ForeignKey("trainings.id"), nullable=True)
    model_id = Column(String, ForeignKey("models.id"), nullable=True)

    dataset = relationship("Dataset", back_populates="flows")
    training = relationship("Training", back_populates="flows")
    model = relationship("Model", back_populates="flows")
