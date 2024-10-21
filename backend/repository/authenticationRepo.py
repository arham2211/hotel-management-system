from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas, JWTtoken
import oauth2
from fastapi.security import OAuth2PasswordRequestForm

def loginFunc(logIn: OAuth2PasswordRequestForm, db: Session):
    
    user = db.query(models.User).filter(
        (models.User.email == logIn.username) | (models.User.username == logIn.username)
    ).first()

    
    if not user:
        admin = db.query(models.Admin).filter(models.Admin.username == logIn.username).first()
        if not admin:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wrong Credentials")

    
        access_token = JWTtoken.create_access_token(data={"sub": admin.username, "role": "admin"})
        return schemas.Token(access_token=access_token, token_type="bearer")

    
    if not Hash.verify(logIn.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Password")

    
    access_token = JWTtoken.create_access_token(
        data={"sub": user.email, "role": "user"}
    )
    return schemas.Token(access_token=access_token, token_type="bearer")
