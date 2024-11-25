from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
from repository import paymentRepo

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
from repository import paymentRepo

def add_new_tour(request: schemas.makeTourReservation, db: Session):
    try:
        # Start a transaction
        # Query to get the last bill for the user
        bill = db.query(models.Bill).filter(models.Bill.user_id == request.user_id).order_by(models.Bill.id.desc()).first()

        if not bill:
            raise HTTPException(status_code=404, detail="Bill not found. You haven't booked a room yet. First book a room and then try to book a tour.")

        # Query to get the tour price
        tour = db.query(models.Tour).filter(models.Tour.id == request.tour_id).first()
        if not tour:
            raise HTTPException(status_code=404, detail="Tour not found.")
        
        cost = tour.price

        # Create a new payment
        new_payment = paymentRepo.make_payment(schemas.Payment(amount=cost, type="Tour", bill_id=bill.id), db)

        # Create a new tour reservation
        new_reservation = models.TourReservation(
            tour_id=request.tour_id,
            user_id=request.user_id,
            payment_id=new_payment.id,
            time=request.time,
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



def get_all_tour_reservation(db: Session,
                    user_id: Optional[int] = Query(None),
                    tour_id: Optional[int] = Query(None)):

    tour=db.query(models.TourReservation)
    if user_id is not None:
        tour = tour.filter(models.TourReservation.user_id==user_id)
    if tour_id is not None:
        tour = tour.filter(models.TourReservation.tour_id==tour_id)
    
    return tour.all()


def get_all_tours(db: Session):

    tour=db.query(models.Tour)
    return tour.all()

def get_info_for_user(id,db):
    tour=db.query(models.TourReservation).join(models.Tour, models.TourReservation.tour_id==models.Tour.id ).join(
        models.Payment, models.TourReservation.payment_id==models.Payment.id
    )
    tour=tour.filter(models.TourReservation.user_id==id)
    return tour.all()

