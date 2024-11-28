from fastapi import Query, HTTPException, status,Depends
from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
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

'''
# BEGIN
#     DECLARE v_cost NUMBER;
#     DECLARE v_bill_id NUMBER;
#     DECLARE v_payment_id NUMBER;
# BEGIN
#     SELECT cost INTO v_cost 
#     FROM Tour 
#     WHERE id = tour_id;

#     SELECT bill_id INTO v_bill_id
#     FROM Bill 
#     WHERE user_id = user_id 
#     ORDER BY id DESC
#     FETCH FIRST 1 ROWS ONLY;

#     INSERT INTO Payment (amount, type, bill_id) 
#     VALUES (v_cost, 'Tour', v_bill_id)
#     RETURNING id INTO v_payment_id;

#     INSERT INTO TourReservation (tour_id, user_id, payment_id, time) 
#     VALUES (:tour_id, :user_id, v_payment_id, :time);

#     COMMIT;
# EXCEPTION
#     WHEN OTHERS THEN
#         -- Rollback in case of any error
#         ROLLBACK;
#         RAISE;
# END;
# /
'''



def get_all_tour_reservation(db: Session,
                    user_id: Optional[int] = Query(None),
                    tour_id: Optional[int] = Query(None)):

    tour=db.query(models.TourReservation)
    if user_id is not None:
        tour = tour.filter(models.TourReservation.user_id==user_id)
    if tour_id is not None:
        tour = tour.filter(models.TourReservation.tour_id==tour_id)
    
    return tour.all()

'''
SELECT * 
FROM TourReservation 
WHERE (user_id = user_id)
  AND (tour_id =tour_id);
'''


def get_all_tours(db: Session):
    tour=db.query(models.Tour)
    return tour.all()

# SELECT * FROM Tour




def get_info_for_user(db: Session, bill_id: Optional[int] = None, user_id: Optional[int] = None):
    tour=db.query(models.TourReservation).join(models.Tour, models.TourReservation.tour_id==models.Tour.id ).join(
        models.Payment, models.TourReservation.payment_id==models.Payment.id
    )
    if(bill_id):
        tour=tour.filter(models.Payment.bill_id==bill_id)

    if(user_id):
        tour=tour.filter(models.TourReservation.user_id==user_id)
    return tour.all()

'''
SELECT TR.*, T.*, P.* 
FROM TourReservation TR
JOIN Tour T ON TR.tour_id = T.id
JOIN Payment P ON TR.payment_id = P.id
WHERE (:bill_id IS NULL OR P.bill_id = :bill_id)
  AND (:user_id IS NULL OR TR.user_id = :user_id);
'''


def updateTour(id: int, 
               price: Optional[int] = None, 
               location: Optional[str] = None, 
               tour_guide_id: Optional[int] = None, 
               db: Session = Depends):

    # Fetch the Tour record by its ID
    tour = db.query(models.Tour).filter(models.Tour.id == id).first()

    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour ID not found")   
    
    # Update the Tour fields if they are provided
    if price is not None:
        tour.price = price
    if location:
        tour.location = location
    if tour_guide_id:
        tour.tour_guide_id = tour_guide_id
    
    # Commit the changes to the database
    db.commit()
    db.refresh(tour)
    return tour

def addTour(request: schemas.Tour, db: Session = Depends):
    new_tour = models.Tour(
        price=request.price,
        location=request.location,
        tour_guide_id=request.tour_guide_id
    )
    
    db.add(new_tour)
    db.commit()
    db.refresh(new_tour)
    return new_tour