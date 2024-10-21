from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import Annotated
import oauth2
from repository import user

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


@router.post("/")
def sign_up(request: schemas.User, db: Session= Depends(get_db)):  
    newuser= user.signUp(request,db)
    if newuser:
        return newuser


@router.get("/{id}",response_model=schemas.User)
def get_user(id, db: Session= Depends(get_db)):
    return user.getUserInfo(id,db)



@router.delete("/{id}")
def del_user(id, db: Session= Depends(get_db)):
    return user.deleteUser(id,db)
        
 