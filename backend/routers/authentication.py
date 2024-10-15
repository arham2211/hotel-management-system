from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas, JWTtoken
import oauth2
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(

    tags = ["Authentication"]
)

get_db = database.get_db


@router.post('/login')
def login(logIn: OAuth2PasswordRequestForm = Depends(), db: Session= Depends(get_db)):
    user = db.query(models.User).filter(
        (models.User.email == logIn.username) | (models.User.username == logIn.username)
    ).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wrong Credentials")


    if not Hash.verify(logIn.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Password")
    
 
    access_token = JWTtoken.create_access_token(
        data={"sub": user.email}
    )
    return schemas.Token(access_token=access_token, token_type="bearer")

