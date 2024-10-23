from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional

def get_all_bookings(db: Session, user_id: Optional[int] = Query(None), room_id: Optional[int] = Query(None)):
    bookings = db.query(models.Booking)
    
    if user_id is not None:
        bookings = bookings.filter(models.Booking.user_id == user_id)
    if room_id is not None:
        bookings = bookings.filter(models.Booking.room_id == room_id)
    
    return bookings.all()

