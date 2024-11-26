from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, schemas
from typing import List, Optional
from repository import partyRepo

router = APIRouter(

    tags = ["party"],
    prefix = "/party"
)

get_db = database.get_db

@router.post("/")
def add_new_party(request:schemas.makePartyReservation,db:Session=Depends(get_db)):
    return partyRepo.add_new_party(request,db)

@router.get("/", response_model=List[schemas.PartyReservation])
def get_all_party_reservation(db: Session = Depends(get_db),
                    user_id: Optional[int] = Query(None),
                    hall_id: Optional[int] = Query(None)):


    party = partyRepo.get_all_party_reservation(db,user_id,hall_id)
    return party
    
@router.get("/halls/", response_model=List[schemas.PartyHalls])
def get_all_party_halls(db: Session = Depends(get_db)):
    return partyRepo.get_all_party_halls(db)


@router.get("/details/", response_model=List[schemas.showUserPartyInfoAll])
def get_info_for_user(bill_id: Optional[int]=None,
                         user_id:Optional[int]=None,
                        db:Session=Depends(get_db)):
    info = partyRepo.get_info_for_user(db,bill_id,user_id)
    return info