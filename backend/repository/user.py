from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import Annotated
import oauth2

def signUp(request: schemas.User,db:Session):
    verify_user = db.query(models.User).filter(models.User.username == request.username).first()
    verify_email = db.query(models.User).filter(models.User.email == request.email).first()
    
    if verify_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail = "User Already Exists")
    
    if verify_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail = "Email Already Registered")
    
    new_user = models.User(username = request.username, email = request.email, password = Hash.get_password_hash(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def getUserInfo(id:int, db:Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def deleteUser(id:int, db:Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = "User not found")
    
    db.delete(user)
    db.commit()
    return {"detail": "Deleted Successfully."}

