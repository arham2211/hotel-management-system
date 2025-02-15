from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas, JWTtoken
import oauth2
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime

def loginFunc(logIn: OAuth2PasswordRequestForm, db: Session):
    role = ""
    user = db.query(models.User).filter(
        (models.User.email == logIn.username) | (models.User.username == logIn.username)
    ).first()
    role = "user"

    if not user:
        admin = db.query(models.Admin).filter(models.Admin.username == logIn.username).first()
        role = "admin"
        if not admin:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wrong Credentials")

        access_token = JWTtoken.create_access_token(data={"sub": admin.username, "role": role})
        return schemas.Token(access_token=access_token, token_type="bearer")

    if not Hash.verify(logIn.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Password")

    access_token = JWTtoken.create_access_token(
        data={"sub": user.email, "role": role}
    )
    return schemas.Token(access_token=access_token, token_type="bearer", role=role)


# def log_to_file(message: str):
#     try:
#         with open("../logs/signup_logs.txt", "a") as log_file:  # Open the file in append mode
#             current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current timestamp
#             log_file.write(f"{current_time} - {message}\n")  # Write message with timestamp
#     except Exception as e:
#         print(f"Error logging to file: {e}")


def signUpFunc(request: schemas.UserSignUp, db: Session):  
    verify_user = db.query(models.User).filter(models.User.username == request.username).first()
    verify_email = db.query(models.User).filter(models.User.email == request.email).first()
    
    if verify_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User Already Exists")
    
    if verify_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email Already Registered")
    
    
    new_user = models.User(username=request.username, email=request.email, password=Hash.get_password_hash(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
    
    # access_token = JWTtoken.create_access_token(data={"sub": new_user.email, "role": "user"})
    
    # return schemas.Token(access_token=access_token, token_type="bearer")
