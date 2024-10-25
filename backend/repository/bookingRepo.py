from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional
from repository import billRepo, paymentRepo

def get_all_bookings(db: Session, user_id: Optional[int] = Query(None), room_id: Optional[int] = Query(None)):
    bookings = db.query(models.Booking)
    
    if user_id is not None:
        bookings = bookings.filter(models.Booking.user_id == user_id)
    if room_id is not None:
        bookings = bookings.filter(models.Booking.room_id == room_id)
    
    return bookings.all()

def add_new_booking(request:schemas.makeBooking, db:Session):
    found_room_id = db.query(models.Room).filter(models.Room.category_id==request.room_cat_id).first()
    new_bill = billRepo.add_new_bill(schemas.addBill(user_id=request.user_id,start_date=request.start_date
                                                     ,end_date=request.end_date) ,db)

    new_payment=paymentRepo.make_payment(schemas.Payment(amount=request.totalCost,type="Booking",
                                                         bill_id=new_bill.id),db)


    new_booking = models.Booking(room_id=found_room_id.id, 
                                 user_id=request.user_id,
                                 start_date=request.start_date,
                                 end_date=request.end_date,
                                 payment_id=new_payment.id,
                                 num_people=request.num_people) 
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    curr_user=db.query(models.User).filter(models.User.id==new_bill.user_id).first()
    curr_user.first_name = request.first_name
    curr_user.last_name = request.last_name
    curr_user.phone_number = request.phone_number

    db.commit()

    db.refresh(new_booking)
    return new_booking