from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional

def get_all_payments(db: Session,
                    bill_id: Optional[int] = Query(None),
                    type: Optional[str] = Query(None)):
    all_payments=db.query(models.Payment)
    if bill_id:
       all_payments=all_payments.filter(models.Payment.bill_id==bill_id)
    if type:
        all_payments=all_payments.filter(models.Payment.type==type)
    return all_payments


def make_payment(request:schemas.Payment, db:Session):
    new_payment= models.Payment(amount=request.amount,type=request.type,bill_id=request.bill_id)
    db.add(new_payment)
    db.commit()

    curr_bill = db.query(models.Bill).filter(models.Bill.id==new_payment.bill_id).first()
    curr_bill.total_amount = curr_bill.total_amount+request.amount
    db.commit()


    db.refresh(new_payment)
    return new_payment