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

'''''
SELECT * 
FROM Booking
WHERE (user_id IS NULL OR user_id = user_id_param)
  AND (room_id IS NULL OR room_id = room_id_param);
'''




def add_new_booking(request:schemas.makeBooking, db:Session):
    
    found_room_id = db.query(models.Room).filter(models.Room.category_id==request.room_cat_id)
    found_room_id = found_room_id.filter(models.Room.booked_status==0).first()
    #print("YOYOYOYOYOYOYOYOYOYOYOYOYOYOYOOYOYOYOYOYOY" ,found_room_id.id)
    rid=found_room_id.id
    new_bill = billRepo.add_new_bill(schemas.addBill(user_id=request.user_id,
                                                     first_name=request.first_name,
                                                     last_name=request.last_name,
                                                     phone_number=request.phone_number) ,db)
    bid=new_bill.id

    new_payment=paymentRepo.make_payment(schemas.Payment(amount=request.total_cost,type="Booking",
                                                         bill_id=new_bill.id),db)
    pid=new_payment.id

   # found_room = db.query(models.Room).filter(models.Room.category_id==request.room_cat_id).first()


   # print("hihihihi")
    new_booking = models.Booking(room_id=rid, 
                                 user_id=request.user_id,
                                 start_date=request.start_date,
                                 end_date=request.end_date,
                                 payment_id=pid,
                                 num_people=request.num_people,
                                 bill_id=bid) 
    print("ASIMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", new_booking.id)

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

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

