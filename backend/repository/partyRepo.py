from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
from repository import paymentRepo

def add_new_party(request: schemas.makePartyReservation, db: Session):
    try:
        bill = db.query(models.Bill).filter(models.Bill.user_id == request.user_id).order_by(models.Bill.id.desc()).first()

        if not bill:
            raise HTTPException(status_code=404, detail="Bill not found. You haven't booked a room yet. First book a room and then try to reserve a party hall.")

        hall = db.query(models.PartyHalls).filter(models.PartyHalls.id == request.hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Party hall not found.")

        new_payment = paymentRepo.make_payment(schemas.Payment(amount=request.total_amount, type="Party", bill_id=bill.id), db)
        new_reservation = models.PartyReservation(
            type=request.type,
            hall_id=request.hall_id,
            user_id=request.user_id,
            payment_id=new_payment.id,
            start_time=request.start_time,
            end_time=request.end_time,
        )

        # Add and commit the new reservation
        db.add(new_reservation)
        db.commit()
        db.refresh(new_reservation)
        
        return new_reservation
    
    except Exception as e:
        # Rollback the transaction in case of any failure
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Close the database session
        db.close()    
'''''
DECLARE
    v_bill_id NUMBER;
    v_hall_price NUMBER;
    v_payment_id NUMBER;
BEGIN
    -- Step 1: Get the last bill for the user
    SELECT id 
    INTO v_bill_id
    FROM Bill
    WHERE user_id = :user_id
    ORDER BY id DESC
    FETCH FIRST 1 ROWS ONLY;

    IF v_bill_id IS NULL THEN
        RAISE_APPLICATION_ERROR(-20001, 'Bill not found. You haven''t booked a room yet. First book a room and then try to reserve a party hall.');
    END IF;

    -- Step 2: Get the price of the party hall
    SELECT price 
    INTO v_hall_price
    FROM PartyHalls
    WHERE id = :hall_id;

    IF v_hall_price IS NULL THEN
        RAISE_APPLICATION_ERROR(-20002, 'Party hall not found.');
    END IF;

    -- Step 3: Insert the new payment
    INSERT INTO Payment (amount, type, bill_id)
    VALUES (:total_amount, 'Party', v_bill_id)
    RETURNING id INTO v_payment_id;

    -- Step 4: Insert the new party reservation
    INSERT INTO PartyReservation (type, hall_id, user_id, payment_id, start_time, end_time)
    VALUES (:type, :hall_id, :user_id, v_payment_id, :start_time, :end_time);

    -- Commit the transaction
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback in case of an error
        ROLLBACK;
        RAISE;
END;
/
'''


def get_all_party_reservation(db: Session,
                    user_id: Optional[int] = Query(None),
                    hall_id: Optional[int] = Query(None)):

    party=db.query(models.PartyReservation)
    if user_id is not None:
        party = party.filter(models.PartyReservation.user_id==user_id)
    if hall_id is not None:
        party = party.filter(models.PartyReservation.hall_id==hall_id)
    
    return party.all()

''''
SELECT * 
FROM PartyReservation
WHERE (:user_id IS NULL OR user_id = :user_id)
  AND (:hall_id IS NULL OR hall_id = :hall_id);
'''


def get_all_party_halls(db: Session):
    return db.query(models.PartyHalls).all()

#SELECT * FROM PartyHalls;


def get_info_for_user(db: Session, bill_id: Optional[int] = None, user_id: Optional[int] = None):
    party=db.query(models.PartyReservation).join(models.PartyHalls, models.PartyReservation.hall_id==models.PartyHalls.id ).join(
        models.Payment, models.PartyReservation.payment_id==models.Payment.id
    )
    if bill_id:
        party=party.filter(models.Payment.bill_id==bill_id)
    if user_id:
        party=party.filter(models.PartyReservation.user_id==user_id)
    return party.all()

''''
SELECT pr.*, ph.*, p.*
FROM PartyReservation pr
JOIN PartyHalls ph ON pr.hall_id = ph.id
JOIN Payment p ON pr.payment_id = p.id
WHERE (:bill_id IS NULL OR p.bill_id = :bill_id)
  AND (:user_id IS NULL OR pr.user_id = :user_id);
'''