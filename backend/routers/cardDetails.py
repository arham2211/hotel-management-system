from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import Annotated, Optional
import oauth2
from repository import userRepo


router = APIRouter(

    tags = ["Card Details"],
    prefix = "/cardDetails"
)

get_db = database.get_db


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




