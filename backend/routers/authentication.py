from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas, JWTtoken
import oauth2
from fastapi.security import OAuth2PasswordRequestForm
from repository import user


router = APIRouter(
    tags=["Authentication"]
)

get_db = database.get_db



@router.post('/register')  
def sign_up(request: schemas.User, db: Session = Depends(get_db)):  
    
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


@router.post('/login')
def login(logIn: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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
