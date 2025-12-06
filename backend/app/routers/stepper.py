import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/stepper", tags=["stepper"])

# --- Dataset Endpoints ---


@router.post("/datasets", response_model=schemas.Dataset)
def create_dataset(dataset: schemas.DatasetCreate, db: Session = Depends(get_db)):
    # Mock generating some images for the dataset
    mock_images = []
    for i in range(1, 21):  # 20 mock images
        mock_images.append(
            {
                "id": str(uuid.uuid4()),
                "name": f"image_{i:03d}.jpg",
                "path": f"/data/images/image_{i:03d}.jpg",
                "size": "1024x768",
                "format": "jpg",
                "tags": ["car", "person"] if i % 2 == 0 else ["bike"],
                "url": "https://placehold.co/600x400?text=YOLO+Image",  # Placeholder for demo
            }
        )

    db_dataset = models.Dataset(**dataset.model_dump(), images_metadata=mock_images)
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset


@router.get("/datasets", response_model=list[schemas.Dataset])
def read_datasets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Dataset).offset(skip).limit(limit).all()


@router.get("/datasets/{dataset_id}", response_model=schemas.Dataset)
def read_dataset(dataset_id: str, db: Session = Depends(get_db)):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


# --- Training Endpoints ---


@router.post("/trainings", response_model=schemas.Training)
def create_training_config(training: schemas.TrainingCreate, db: Session = Depends(get_db)):
    db_training = models.Training(**training.model_dump())
    db.add(db_training)
    db.commit()
    db.refresh(db_training)
    return db_training


@router.get("/trainings/{training_id}", response_model=schemas.Training)
def read_training(training_id: str, db: Session = Depends(get_db)):
    training = db.query(models.Training).filter(models.Training.id == training_id).first()
    if training is None:
        raise HTTPException(status_code=404, detail="Training configuration not found")
    return training
