from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import List

def createRoom(create: schemas.Room, db: Session):
    new_room = models.Room(name = create.name, description = create.description, price = create.price, beds = create.beds, baths = create.baths, image = create.image, rating = create.rating)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room
