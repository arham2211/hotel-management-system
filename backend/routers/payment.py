from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional
from repository import paymentRepo

router = APIRouter(

    tags = ["Payment"],
    prefix = "/payment"
)

get_db = database.get_db

@router.get("/",response_model=List[schemas.ShowPayment])
def get_all_payments(db: Session = Depends(get_db),
                    bill_id: Optional[int] = Query(None),
                    type: Optional[str] = Query(None)):
    return paymentRepo.get_all_payments(db,bill_id,type)


@router.post("/")
def make_payment(request:schemas.Payment, db:Session=Depends(get_db)):
    return paymentRepo.make_payment(request,db)


@router.put("/update/{id}")
def update_payment(id: int, 
                   amount: Optional[int] = Query(None),
                   type: Optional[str] = Query(None),
                   bill_id: Optional[int] = Query(None),
                   db: Session = Depends(get_db)):

    return paymentRepo.updatePayment(id, amount, type, bill_id, db)

