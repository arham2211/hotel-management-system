from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
from repository import paymentRepo

def add_new_tour(request:schemas.makeTourReservation,db:Session):
    bill = db.query(models.Bill).filter(models.Bill.user_id == request.user_id).order_by(models.Bill.id.desc()).first()

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found. You havent booked a room yet. First book a room and then try to book a tour.")

    tour = db.query(models.Tour).filter(models.Tour.id==request.tour_id).first()
    cost = tour.price
    # Create a new payment
    new_payment = paymentRepo.make_payment(schemas.Payment(amount=cost, type="Tour", bill_id=bill.id), db)

    new_reservation = models.TourReservation(
        tour_id=request.tour_id,
        user_id=request.user_id,
        payment_id=new_payment.id,
        time=request.time,
    )


    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    return new_reservation


def get_all_tour_reservation(db: Session,
                    user_id: Optional[int] = Query(None),
                    tour_id: Optional[int] = Query(None)):

    tour=db.query(models.TourReservation)
    if user_id is not None:
        tour = tour.filter(models.TourReservation.user_id==user_id)
    if tour_id is not None:
        tour = tour.filter(models.TourReservation.tour_id==tour_id)
    
    return tour.all()