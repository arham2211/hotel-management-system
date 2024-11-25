from sqlalchemy.orm import Session, joinedload
import database, models, schemas
from typing import Optional

def show_only_bill_info(db:Session,
                        bill_id: Optional[int]=None,
                         user_id:Optional[int]=None):
    bill = db.query(models.Bill)
    if bill_id:
        bill = bill.filter(models.Bill.id==bill_id)
    if user_id:
        bill = bill.filter(models.Bill.user_id==user_id)
    return bill



def show_detailed_bill_info(db: Session, bill_id: Optional[int] = None, user_id: Optional[int] = None):
    # Fetch bills based on the filters
    query = db.query(models.Bill).join(
        models.User, models.Bill.user_id==models.User.id).join(
            models.Payment, models.Bill.id == models.Payment.bill_id).join (
                models.Booking, models.Bill.id == models.Booking.bill_id) 

    if bill_id:
        query = query.filter(models.Bill.id == bill_id)
    if user_id:
        query = query.filter(models.Bill.user_id == user_id)
    bills = query.all()

    return bills






def add_new_bill(request:schemas.addBill,db:Session):
    newBill=models.Bill(user_id=request.user_id,
                        first_name=request.first_name,
                        last_name=request.last_name,
                        phone_number=request.phone_number,
                        total_amount=0)
    db.add(newBill)
    db.commit()
    db.refresh(newBill)
    return newBill