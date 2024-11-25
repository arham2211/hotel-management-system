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
def get_all_room_cat(db: Session = Depends(get_db)):
    rooms = db.query(models.RoomCategory).all()
    return rooms

@router.get("/three/",response_model=List[schemas.ShowRoomCat])
def get_three_rooms_cat(limit: int = 3, db: Session = Depends(get_db)):
    rooms = db.query(models.RoomCategory).filter(models.RoomCategory.rating.in_([3, 4, 5])).limit(limit).all()
    if rooms:
        return rooms
    else:
        return "No rooms found."

@router.post("/")
def create_room_cat(create: schemas.RoomCategory, db: Session= Depends(get_db)):
    return roomRepo.createRoom(create,db)

@router.get("/linked/", response_model=List[schemas.ShowRooms])
def get_all_rooms(db:Session = Depends(get_db)):
    rooms = db.query(models.Room).all()
    return rooms

@router.get("/available/{cat_id}", response_model=List[schemas.ShowRooms])
def get_all_rooms_category(cat_id, db:Session = Depends(get_db)):
    
    rooms=db.query(models.Room).filter(models.Room.category_id==cat_id)
    return rooms
@router.get("/catprice/{type}", response_model=List[schemas.roomCatPrice])
def get_category_with_price(type, db: Session = Depends(get_db)):
    
    all_info = (
        db.query(models.RoomCategory).filter(models.RoomCategory.type == type)
    )
    return all_info

@router.get("/category/{data}")
def get_category_details(data,db: Session=Depends(get_db)):
    return roomRepo.get_category_details(data,db)
