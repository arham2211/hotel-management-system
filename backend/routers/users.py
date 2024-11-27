from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import Annotated, Optional
import oauth2
from repository import userRepo

router = APIRouter(

    tags = ["Users"],
    prefix = "/users"
)

get_db = database.get_db


@router.get("/")
def get_all_users(db: Session = Depends(get_db),current_user: schemas.User = Depends(oauth2.get_current_user)
):
    users = db.query(models.User).all()
    return users

@router.get("/{id}",response_model=schemas.User)
def get_user(id, db: Session= Depends(get_db)):
    return userRepo.getUserInfo(id,db)


@router.get("/info/{username}")
def get_user_id(username,db: Session = Depends(get_db)):
    return userRepo.getUserId(username,db)
    

@router.delete("/{id}")
def del_user(id, db: Session= Depends(get_db)):
    return userRepo.deleteUser(id,db)
        
@router.post("/update/{username}")
def update_user(username,
                new_username:Optional[str]= Query(None),
                new_email:Optional[str]=Query(None),
                new_password: Optional[str]=Query(None),
                db:Session=Depends(get_db)):
    return userRepo.updateUser(username,new_username,new_email,new_password,db)

 