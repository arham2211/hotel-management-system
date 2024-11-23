from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
from repository import paymentRepo

def add_new_party(request: schemas.makePartyReservation, db: Session):
    try:
        # Start a transaction
        # Query to get the last bill for the user
        bill = db.query(models.Bill).filter(models.Bill.user_id == request.user_id).order_by(models.Bill.id.desc()).first()

        if not bill:
            raise HTTPException(status_code=404, detail="Bill not found. You haven't booked a room yet. First book a room and then try to reserve a party hall.")

        # Query to get the price of the party hall
        hall = db.query(models.PartyHalls).filter(models.PartyHalls.id == request.hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Party hall not found.")
        
        cost = hall.price

        # Create a new payment
        new_payment = paymentRepo.make_payment(schemas.Payment(amount=cost, type="Party", bill_id=bill.id), db)

        # Create a new party reservation
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

def get_all_party_reservation(db: Session,
                    user_id: Optional[int] = Query(None),
                    hall_id: Optional[int] = Query(None)):

    party=db.query(models.PartyReservation)
    if user_id is not None:
        party = party.filter(models.PartyReservation.user_id==user_id)
    if hall_id is not None:
        party = party.filter(models.PartyReservation.hall_id==hall_id)
    
    return party.all()

    # type :str 
    # hall_id :int
    # user_id :int
    # payment_id :int 
    # start_time:datetime
    # end_time :datetime