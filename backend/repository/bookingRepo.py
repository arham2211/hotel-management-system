from fastapi import APIRouter, Depends, Query,HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import database, models, schemas
from typing import List, Optional
from repository import billRepo, paymentRepo
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime


def get_all_bookings(db: Session, user_id: Optional[int] = Query(None), room_id: Optional[int] = Query(None)):
    bookings = db.query(models.Booking)
    
    if user_id is not None:
        bookings = bookings.filter(models.Booking.user_id == user_id)
    if room_id is not None:
        bookings = bookings.filter(models.Booking.room_id == room_id)
    
    return bookings.all()

'''''
SELECT * 
FROM Booking
WHERE (user_id IS NULL OR user_id = user_id_param)
  AND (room_id IS NULL OR room_id = room_id_param);
'''

def log_to_file(message: str):
    log_file_path = "C:\\Users\\Asim PC\\Desktop\\DB-Project\\backend\\logs\\booking_logs.txt" 
    
    try:
        with open(log_file_path, "a") as log_file:  # Open the file in append mode
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current timestamp
            log_file.write(f"{current_time} - {message}\n")  # Write message with timestamp
    except Exception as e:
        print(f"Error logging to file: {e}")


def add_new_booking(request: schemas.makeBooking, db: Session):
    try:
        # Start the transaction
        found_room = db.query(models.Room).filter(
            models.Room.category_id == request.room_cat_id,
            models.Room.booked_status == 0
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
        
        # Update room booked status
       # found_room.booked_status = 1
        db.commit()
        db.refresh(new_booking)
        log_to_file(f"New booking created with ID: {new_booking.id}, User: {request.user_id}, Room ID: {rid}, Start Date: {request.start_date}, End Date: {request.end_date}")
        
        return new_booking
    except (SQLAlchemyError, ValueError) as e:
        db.rollback()
        raise e
'''
DECLARE
    v_room_id NUMBER;
    v_new_bill_id NUMBER;
    v_payment_id NUMBER;
    v_new_booking_id NUMBER;
BEGIN
    -- Step 1: Find the available room
    SELECT id
    INTO v_room_id
    FROM Room
    WHERE category_id = room_cat_id_param
    AND booked_status = 0
    FETCH FIRST 1 ROWS ONLY;

    IF v_room_id IS NULL THEN
        RAISE_APPLICATION_ERROR(-20001, 'No available room found.');
    END IF;

    -- Step 2: Create the new bill
    INSERT INTO Bill (user_id, first_name, last_name, phone_number)
    VALUES (user_id_param, first_name_param, last_name_param, phone_number_param)
    RETURNING id INTO v_new_bill_id;

    -- Step 3: Create the payment for the new booking
    INSERT INTO Payment (amount, type, bill_id)
    VALUES (total_cost_param, 'Booking', v_new_bill_id)
    RETURNING id INTO v_payment_id;

    -- Step 4: Create the new booking
    INSERT INTO Booking (room_id, user_id, start_date, end_date, payment_id, num_people, bill_id)
    VALUES (v_room_id, user_id_param, start_date_param, end_date_param, v_payment_id, num_people_param, v_new_bill_id)
    RETURNING id INTO v_new_booking_id;

    -- Step 5: Commit the transaction
    COMMIT;
    
    -- Return the new booking details
    SELECT * INTO new_booking_details FROM Booking WHERE id = v_new_booking_id;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback in case of an error
        ROLLBACK;
        RAISE;
END;
/
'''


def cancel_booking(id, db: Session):
    booking = db.query(models.Booking).filter(models.Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    bill = db.query(models.Bill).filter(models.Bill.id == booking.bill_id).first()
    payment = db.query(models.Payment).filter(models.Payment.id == booking.payment_id).first()

    log_to_file(f"Booking with ID {id} canceled by user {booking.user_id}.")


    if bill:
        db.delete(bill)
        log_to_file(f"Bill with ID {bill.id} deleted for booking {id}.")
    if payment:
        db.delete(payment)
        log_to_file(f"Payment with ID {payment.id} deleted for booking {id}.")

    db.delete(booking)
    db.commit()
    
    return {"detail": "Deleted successfully."}

'''
DELETE FROM bills WHERE id = (SELECT bill_id FROM bookings WHERE id = :id);
DELETE FROM payments WHERE id = (SELECT payment_id FROM bookings WHERE id = :id);
DELETE FROM bookings WHERE id = :id;
'''


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
'''UPDATE bookings
SET room_id = NVL(:room_id, room_id),
    start_date = NVL(:start_date, start_date),
    end_date = NVL(:end_date, end_date),
    num_people = NVL(:num_people, num_people)
WHERE id = :old_id;
'''


def getTotalBookingsCount(db: Session):
    # Use COUNT() aggregate function to count the total number of rows in the Booking table
    total_bookings = db.query(func.count(models.Booking.id)).scalar()
    return total_bookings
#SELECT COUNT(*) AS total_bookings FROM bookings;
