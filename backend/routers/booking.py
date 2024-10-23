from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional
from repository import bookingRepo


router = APIRouter(

    tags = ["Bookings"],
    prefix = "/bookings"
)

get_db = database.get_db

# @router.get("/", response_model=List[schemas.Booking])
# def get_all_bookings(db:Session=Depends(get_db)):
#     return db.query(models.Booking).all()

# @router.get("/{user_id}",response_model=List[schemas.Booking])
# def get_booking_by_user_id(user_id,db:Session=Depends(get_db)):
#     return db.query(models.Booking).filter(models.Booking.user_id==user_id)

# @router.get("/{room_id}",response_model=List[schemas.Booking])
# def get_booking_by_room_id(room_id,db:Session=Depends(get_db)):
#     return db.query(models.Booking).filter(models.Booking.room_id==room_id)


@router.get("/", response_model=List[schemas.Booking])
def get_all_bookings(db: Session = Depends(get_db),
                    user_id: Optional[int] = Query(None),
                    room_id: Optional[int] = Query(None)):

    bookings = bookingRepo.get_all_bookings(db,user_id,room_id)
    return bookings
    
    
#@router.post("/")
#def add_new_booking(request:schemas.Booking,db: Session = Depends(get_db)):
    