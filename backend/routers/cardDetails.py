from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from repository import userRepo


router = APIRouter(

    tags = ["Card Details"],
    prefix = "/cardDetails"
)

get_db = database.get_db


@router.put("/{user_id}")
def update_card_details(
    user_id: int,
    card_holder: str,
    card_number: int,
    expiry_date: str,
    booking_id: int,
    db: Session = Depends(get_db)
):
    # Fetch the card details by user ID
    card_details = db.query(models.CardDetails).join(
        models.Booking, models.CardDetails.booking_id == models.Booking.id
    ).join(
        models.User, models.Booking.user_id == models.User.id
    ).filter(
        models.User.id == user_id
    ).first()

    # Handle case where no matching card details are found
    if not card_details:
        raise HTTPException(status_code=404, detail="Card details not found for the given user.")

    # Update the card details
    card_details.card_holder = card_holder
    card_details.card_number = card_number
    card_details.expiry_date = expiry_date

    card_details.booking_id = booking_id


    # Save the changes to the database
    db.commit()
    db.refresh(card_details)

    return  card_details

@router.get("/{user_id}/details")
def get_specific_card_details(user_id:int,db: Session = Depends(get_db)):
    card_details = db.query(models.CardDetails).join(
        models.Booking, models.CardDetails.booking_id == models.Booking.id
    ).join(
        models.User, models.Booking.user_id == models.User.id
    ).filter(
        models.User.id == user_id
    ).first()

    return card_details

@router.get("/{id}")
def get_user_id(id:int, db: Session = Depends(get_db)):
    # Query to find the User ID based on the Card Details and Booking relationships
    user = db.query(models.User.id).join(
        models.Booking, models.User.id == models.Booking.user_id
    ).join(
        models.CardDetails, models.Booking.id == models.CardDetails.booking_id
    ).filter(
        models.User.id == id
    ).first()

    # Check if a matching user was found
    if user:
        return True
    else:
        return False


    


@router.post("/")
def add_card_details(request:schemas.CardDetails, db:Session=Depends(get_db)):
    new_card = models.CardDetails(
        card_holder = request.card_holder,
        card_number = request.card_number,
        expiry_date = request.expiry_date,
        booking_id = request.booking_id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card




