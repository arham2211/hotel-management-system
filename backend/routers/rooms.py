from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List
from repository import roomRepo

router = APIRouter(

    tags = ["Rooms"],
    prefix = "/rooms"
)

get_db = database.get_db

@router.get("/")
def get_all_room(db: Session = Depends(get_db)):
    rooms = db.query(models.RoomCategory).all()
    return rooms

@router.get("/three/",response_model=List[schemas.ShowRoom])
def get_three_rooms(limit: int = 3, db: Session = Depends(get_db)):
    rooms = db.query(models.RoomCategory).filter(models.RoomCategory.rating.in_([3, 4, 5])).limit(limit).all()
    if rooms:
        return rooms
    else:
        return "No rooms found."

@router.post("/")
def create_room(create: schemas.RoomCategory, db: Session= Depends(get_db)):
    return roomRepo.createRoom(create,db)

