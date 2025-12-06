from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/flows", tags=["flows"])


@router.post("/", response_model=schemas.Flow)
def create_flow(flow: schemas.FlowCreate, db: Session = Depends(get_db)):
    db_flow = models.Flow(**flow.model_dump())
    db.add(db_flow)
    db.commit()
    db.refresh(db_flow)
    return db_flow


@router.get("/", response_model=list[schemas.Flow])
def read_flows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Flow).offset(skip).limit(limit).all()


@router.get("/{flow_id}", response_model=schemas.Flow)
def read_flow(flow_id: str, db: Session = Depends(get_db)):
    flow = db.query(models.Flow).filter(models.Flow.id == flow_id).first()
    if flow is None:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow


@router.patch("/{flow_id}", response_model=schemas.Flow)
def update_flow(flow_id: str, flow_update: schemas.FlowUpdate, db: Session = Depends(get_db)):
    db_flow = db.query(models.Flow).filter(models.Flow.id == flow_id).first()
    if db_flow is None:
        raise HTTPException(status_code=404, detail="Flow not found")

    update_data = flow_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_flow, key, value)

    db.commit()
    db.refresh(db_flow)
    return db_flow
