from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional
from repository import bookingRepo

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
                        total_amount=0,
                        start_date=request.start_date,
                        end_date=request.end_date)
    db.add(newBill)
    db.commit()
    db.refresh(newBill)
    return newBill