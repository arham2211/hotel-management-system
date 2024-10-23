from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List
from repository import bookingRepo


router = APIRouter(

    tags = ["Bookings"],
    prefix = "/bookings"
)

get_db = database.get_db

@router.get("/", response_model=List[schemas.Booking])
def get_all_bookings(db:Session=Depends(get_db)):
    return db.query(models.Booking).all()