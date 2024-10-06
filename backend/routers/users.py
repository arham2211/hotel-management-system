from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas


router = APIRouter(

    tags = ["Users"],
    prefix = "/users"
)

get_db = database.get_db



@router.get("/")
def get_all_users(db: Session= Depends(get_db)):
    users = db.query(models.User).all()
    return users


@router.post("/")
def sign_up(signUp: schemas.User, db: Session= Depends(get_db)):
    
    verify_user = db.query(models.User).filter(models.User.username == signUp.username).first()
    
    if verify_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail = "User Already Exists")
    
    new_user = models.User(first_name = signUp.first_name, last_name = signUp.last_name, username = signUp.username, email = signUp.email, password = Hash.get_password_hash(signUp.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/{id}")
def get_user(id, db: Session= Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user

@router.delete("/{id}")
def del_user(id, db: Session= Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = "User not found")
    
    user.delete(synchronize_session=False)
    db.commit()
