from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, schemas
from typing import List, Optional
from repository import partyRepo
import  models,schemas

router = APIRouter(

    tags = ["staff"],
    prefix = "/staff"
)
get_db = database.get_db

@router.get("/")
def get_all_staff(db: Session = Depends(get_db)):
    staff=db.query(models.Staff).all()
    return staff


@router.get("/{limit}")
def get_specific_staff(limit:int,db: Session = Depends(get_db)):
    staff=db.query(models.Staff).limit(limit).all()
    return staff