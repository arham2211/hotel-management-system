from sqlalchemy.orm import Session
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


def show_detailed_bill_info(db:Session,bill_id: Optional[int]=None,
                         user_id:Optional[int]=None):
    bill = db.query(models.Bill)
    if bill_id:
        bill = bill.filter(models.Bill.id==bill_id)
    if user_id:
        bill = bill.filter(models.Bill.user_id==user_id)
    return bill


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