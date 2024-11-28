from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional
from datetime import date
from repository import bookingRepo


router = APIRouter(

    tags = ["Bookings"],
    prefix = "/bookings"
)

get_db = database.get_db

@router.get("/", response_model=List[schemas.Booking])
def get_all_bookings(db: Session = Depends(get_db),
                    user_id: Optional[int] = Query(None),
                    room_id: Optional[int] = Query(None),
                    booking_id: Optional[int]=Query(None)):

    bookings = bookingRepo.get_all_bookings(db,user_id,room_id,booking_id)
    return bookings
    

@router.post("/")
def add_new_booking(request:schemas.makeBooking, db:Session=Depends(get_db)):
    return bookingRepo.add_new_booking(request,db)    


@router.delete("/delete/{id}")
def cancel_booking(id, db:Session=Depends(get_db)):
    return bookingRepo.cancel_booking(id,db)

@router.put("/update/{id}")
def update_booking(id,
                   room_id:Optional[int] = Query(None),
                   start_date:Optional[date] = Query(None),
                   end_date:Optional[date] = Query(None),
                   num_people:Optional[int]=Query(None),
                   db:Session=Depends(get_db)
                   ):
    return bookingRepo.updateBooking(id,room_id,start_date,end_date,num_people,db)

@router.get("/total_count/")
def get_booking_total_count(db: Session = Depends(get_db)):
    total_bookings = bookingRepo.getTotalBookingsCount(db)
    return {"total_bookings": total_bookings}
