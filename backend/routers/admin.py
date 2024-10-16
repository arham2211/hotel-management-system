from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import Annotated
import oauth2
from repository import user

router = APIRouter(

    tags = ["Admin"],
    prefix = "/admin"
)

get_db = database.get_db



@router.get("/")
def get_all_admin(db: Session = Depends(get_db),current_user: schemas.Admin = Depends(oauth2.get_admin)
):
    users = db.query(models.Admin).all()
    return users