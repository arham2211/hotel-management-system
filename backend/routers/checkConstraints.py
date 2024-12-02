from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from repository import userRepo


router = APIRouter(

    tags = ["Constraints Checker"],
    prefix = "/constraints"
)

get_db = database.get_db

@router.post("/")
def add_info(request:schemas.checkConstraints, db:Session=Depends(get_db)):

    room_cat = (
        db.query(models.RoomCategory.id)
        .join(models.Room, models.RoomCategory.id == models.Room.category_id)
        .join(models.Booking, models.Room.id == models.Booking.room_id)
        .filter(models.Booking.id == request.booking_id)
        .first()
    )
    new_row = models.CheckConstraints(
        booking_id=request.booking_id,
        room_id=request.room_id,
        room_cat_id=room_cat.id,
        check_in_date=request.check_in_date,
        check_out_date=request.check_out_date,
    )

    db.add(new_row)
    db.commit()
    db.refresh(new_row)
    return new_row


@router.get("/")
def get_details(
    room_id: int,
    room_cat_id: str,
    db: Session = Depends(get_db)
):

    details = db.query(models.CheckConstraints).filter(
        models.CheckConstraints.room_id == room_id,
        models.CheckConstraints.room_cat_id == room_cat_id
    ).all()
    return details


@router.delete("/{book_id}")
def delete_info(book_id:int,db:Session=Depends(get_db)):
    row = db.query(models.CheckConstraints).filter(models.CheckConstraints.booking_id==book_id).first()
    db.delete(row)
    db.commit()
    return "deleted"





    





