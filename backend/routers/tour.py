from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import database, schemas
from typing import List, Optional
from repository import tourRepo


router = APIRouter(

    tags = ["tour"],
    prefix = "/tour"
)

get_db = database.get_db

@router.post("/")
def add_new_tour(request:schemas.makeTourReservation,db:Session=Depends(get_db)):
    return tourRepo.add_new_tour(request,db)

@router.get("/tourReservation/", response_model=List[schemas.TourReservation])
def get_all_tour_reservation(db: Session = Depends(get_db),
                    user_id: Optional[int] = Query(None),
                    tour_id: Optional[int] = Query(None)):


    tour = tourRepo.get_all_tour_reservation(db,user_id,tour_id)
    return tour
    
@router.get("/", response_model=List[schemas.Tour])
def get_all_tours(db: Session = Depends(get_db)):
    tour = tourRepo.get_all_tours(db)
    return tour

@router.get("/{id}", response_model=List[schemas.showUserTourInfoAll])
def get_info_for_user(id,db: Session = Depends(get_db)):
    info = tourRepo.get_info_for_user(id,db)
    return info