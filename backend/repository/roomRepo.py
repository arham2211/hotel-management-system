from fastapi import  Depends
from sqlalchemy.orm import Session
import  models, schemas
from typing import List

def createRoom(create: schemas.RoomCategory, db: Session):
    new_room = models.RoomCategory(type = create.type, description = create.description, price = create.price, beds = create.beds, baths = create.baths, image = create.image, rating = create.rating)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

def get_category_details(data,db: Session):
    details=db.query(models.RoomCategory)
    result = " ".join(word.capitalize() for word in data.split("-"))
    details=details.filter(models.RoomCategory.type==result).first()
    return details
    

