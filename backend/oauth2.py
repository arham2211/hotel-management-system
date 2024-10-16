from fastapi import Depends, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
import JWTtoken

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
oauth2_admin = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


    user = JWTtoken.verify_token(token, credentials_exception)
    # Check if the user has a valid role (e.g., 'user')
    if user.get("role") != "user":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return user


def get_admin(token: Annotated[str, Depends(oauth2_admin)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


    admin = JWTtoken.verify_token(token, credentials_exception)

    # Check if the user has the 'admin' role
    if admin.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return admin
