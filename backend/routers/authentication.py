from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas, JWTtoken
import oauth2
from fastapi.security import OAuth2PasswordRequestForm
from repository import userRepo
from repository import authenticationRepo

router = APIRouter(
    tags=["Authentication"]
)

get_db = database.get_db



@router.post('/register')  
def sign_up(request: schemas.UserSignUp, db: Session = Depends(get_db)):  
    return authenticationRepo.signUpFunc(request,db)
    


@router.post('/login')
def login(logIn: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return authenticationRepo.loginFunc(logIn,db)