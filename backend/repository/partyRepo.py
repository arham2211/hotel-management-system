from fastapi import APIRouter, Depends, Query,status
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
from repository import paymentRepo


def updateAvailability(id,status,db):
    hall= db.query(models.PartyHalls).filter(models.PartyHalls.id==id).first()
    hall.available=status
    db.commit()
    db.refresh(hall)
    return hall

def add_new_party(request: schemas.makePartyReservation, db: Session):
    try:
        # Get the latest bill for the user
        bill = db.query(models.Bill).filter(models.Bill.user_id == request.user_id).order_by(models.Bill.id.desc()).first()

        if not bill:
            raise HTTPException(status_code=404, detail="Bill not found. You haven't booked a room yet. First book a room and then try to reserve a party hall.")

        # Query the party hall with the specified ID and ensure it is available
        hall = db.query(models.PartyHalls).filter(
            models.PartyHalls.id == request.hall_id,
            models.PartyHalls.available == True
        ).first()

        if not hall:
            raise HTTPException(status_code=404, detail="Party hall not found or not available.")


        # Create a new payment
        new_payment = paymentRepo.make_payment(schemas.Payment(amount=request.total_amount, type="Party", bill_id=bill.id), db)
        
        # Create a new party reservation
        new_reservation = models.PartyReservation(
            type=request.type,
            hall_id=request.hall_id,
            user_id=request.user_id,
            payment_id=new_payment.id,
            start_time=request.start_time,
            end_time=request.end_time,
        )
        
        # Mark the hall as unavailable
        # Add and commit the new reservation and update the hall status
        db.add(new_reservation)
        db.commit()
        db.refresh(new_reservation)
      #  db.refresh(hall)
        
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


def get_all_party_halls(db: Session):
    return db.query(models.PartyHalls).all()


def get_info_for_user(db: Session, bill_id: Optional[int] = None, user_id: Optional[int] = None):
    party=db.query(models.PartyReservation).join(models.PartyHalls, models.PartyReservation.hall_id==models.PartyHalls.id ).join(
        models.Payment, models.PartyReservation.payment_id==models.Payment.id
    )
    if bill_id:
        party=party.filter(models.Payment.bill_id==bill_id)
    if user_id:
        party=party.filter(models.PartyReservation.user_id==user_id)
    return party.all()


def updatePartyHall(db,
                    id: int, 
                    name: Optional[str] = None, 
                    capacity: Optional[int] = None, 
                    price: Optional[int] = None, 
                    available: Optional[bool] = None 
                    ):

    # Fetch the PartyHall record by its ID
    party_hall = db.query(models.PartyHalls).filter(models.PartyHalls.id == id).first()

    if not party_hall:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Party Hall ID not found")   
    
    # Update the PartyHall fields if they are provided
    if name:
        party_hall.name = name
    if capacity:
        party_hall.capacity = capacity
    if price:
        party_hall.price = price
    if available is not None:  # Check if available is explicitly provided (as it can be True or False)
        party_hall.available = available
    
    # Commit the changes to the database
    db.commit()
    db.refresh(party_hall)
    return party_hall


