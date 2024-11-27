from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, schemas
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

@router.put("/update/{id}")
def update_bill(id: int, 
                total_amount: Optional[int] = Query(None),
                first_name: Optional[str] = Query(None),
                last_name: Optional[str] = Query(None),
                phone_number: Optional[str] = Query(None),
                db: Session = Depends(get_db)):

    return billRepo.updateBill(id, total_amount, first_name, last_name, phone_number, db)

@router.delete("/")
def delete_bill(id,db:Session=Depends(get_db)):
    return billRepo.delete_bill(id,db)