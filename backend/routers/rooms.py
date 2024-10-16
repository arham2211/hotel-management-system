from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import List


router = APIRouter(

    tags = ["Rooms"],
    prefix = "/rooms"
)

get_db = database.get_db

@router.get("/")
def get_all_rooms(db: Session = Depends(get_db)):
    rooms = db.query(models.Room).all()
    return rooms

@router.get("/three/",response_model=List[schemas.ShowRoom])
def get_three_rooms(limit: int = 3, db: Session = Depends(get_db)):
    rooms = db.query(models.Room).filter(models.Room.rating.in_([3, 4, 5])).limit(limit).all()
    return rooms

@router.post("/")
def create_room(create: schemas.Room, db: Session= Depends(get_db)):
    
   
    new_room = models.Room(name = create.name, description = create.description, price = create.price, beds = create.beds, baths = create.baths, image = create.image, rating = create.rating)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

