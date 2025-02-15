from fastapi import APIRouter, Depends, Query,HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import database, models, schemas
from typing import List, Optional
from repository import billRepo, paymentRepo
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime


def get_all_bookings(db: Session, user_id: Optional[int] = Query(None), room_id: Optional[int] = Query(None), booking_id: Optional[int] = Query(None)):
    bookings = db.query(models.Booking)
    if booking_id is not None:
        bookings = bookings.filter(models.Booking.id == booking_id)
    if user_id is not None:
        bookings = bookings.filter(models.Booking.user_id == user_id)
    if room_id is not None:
        bookings = bookings.filter(models.Booking.room_id == room_id)
    
    return bookings.all()

# def log_to_file(message: str):
#     log_file_path = "C:\\Users\\Asim PC\\Desktop\\DB-Project\\backend\\logs\\booking_logs.txt" 
    
#     try:
#         with open(log_file_path, "a") as log_file:  # Open the file in append mode
#             current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current timestamp
#             log_file.write(f"{current_time} - {message}\n")  # Write message with timestamp
#     except Exception as e:
#         print(f"Error logging to file: {e}")


def update_status(room_id: int, db: Session):
    try:
        # Update the room's booked status to True
        room = db.query(models.Room).filter(models.Room.id == room_id).first()
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        
        room.booked_status = True
        db.add(room)  # Mark for update
        db.commit()
        db.refresh(room)
        
    except Exception as e:
        raise e

def add_new_booking(request: schemas.makeBooking, db: Session):
    try:
        # Start the transaction
        found_room = db.query(models.Room).filter(
            models.Room.category_id == request.room_cat_id,
            models.Room.booked_status == False
        ).first()
        
        
        if not found_room:
            raise ValueError("No available room found for the selected category.")
        
        rid = found_room.id

        # Create a new bill
        new_bill = billRepo.add_new_bill(
            schemas.addBill(
                user_id=request.user_id,
                first_name=request.first_name,
                last_name=request.last_name,
                phone_number=request.phone_number
            ),
            db
        )
        bid = new_bill.id

        # Process the payment
        new_payment = paymentRepo.make_payment(
            schemas.Payment(
                amount=request.total_cost,
                type="Booking",
                bill_id=new_bill.id
            ),
            db
        )
        pid = new_payment.id

        # Create a new booking
        new_booking = models.Booking(
            room_id=rid,
            user_id=request.user_id,
            start_date=request.start_date,
            end_date=request.end_date,
            payment_id=pid,
            num_people=request.num_people,
            bill_id=bid
        )
        db.add(new_booking)
        
        # Update room status
        # update_status(rid, db)
        
        db.commit()
        db.refresh(new_booking)
        
        return new_booking
    except (SQLAlchemyError, ValueError) as e:
        db.rollback()

        raise e



def cancel_booking(id, db: Session):
    booking = db.query(models.Booking).filter(models.Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    bill = db.query(models.Bill).filter(models.Bill.id == booking.bill_id).first()
    payment = db.query(models.Payment).filter(models.Payment.id == booking.payment_id).first()

    if bill:
        db.delete(bill)
    if payment:
        db.delete(payment)


    db.delete(booking)
    db.commit()
    
    return {"detail": "Deleted successfully."}

def updateBooking(id,room_id,start_date,end_date,num_people, db:Session):
    booking=db.query(models.Booking).filter(models.Booking.id==id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = "Booking ID not found")   
    
    # Update the user fields if they are provided
    if room_id:
        booking.room_id = room_id
    if start_date:
        booking.start_date= start_date
    if end_date:
        booking.end_date= end_date
    if num_people:
        booking.num_people = num_people 
    
    # Commit the changes to the database
    db.commit()
    db.refresh(booking)
    return booking


def getTotalBookingsCount(db: Session):
  
    total_bookings = db.query(func.count(models.Booking.id)).scalar()
    return total_bookings



def get_recent_booking(user_id: int, db: Session):
    
    recent_booking = db.query(models.Booking).filter(
        models.Booking.user_id == user_id
    ).order_by(
        models.Booking.id.desc()
    ).first()

    return recent_booking