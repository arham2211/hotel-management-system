from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional
from repository import billRepo


router = APIRouter(

    tags = ["Bill"],
    prefix = "/bill"
)

get_db = database.get_db

@router.get("/", response_model=List[schemas.ShowBill])
def show_only_bill_info(bill_id: Optional[int]=None,
                         user_id:Optional[int]=None,
                        db:Session=Depends(get_db)):
    return billRepo.show_only_bill_info(db,bill_id,user_id)

@router.get("/details/", response_model=List[schemas.ShowBillDetails])
def show_detailed_bill_info(bill_id: Optional[int]=None,
                         user_id:Optional[int]=None,
                        db:Session=Depends(get_db)):
    return billRepo.show_detailed_bill_info(db,bill_id,user_id)

@router.post("/")
def add_new_bill(request:schemas.addBill,db:Session=Depends(get_db)):
    return billRepo.add_new_bill(request,db)



