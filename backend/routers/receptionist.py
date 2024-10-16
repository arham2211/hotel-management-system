from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import database, models, schemas
from typing import Annotated
import oauth2

router = APIRouter(

    tags = ["Receptionist"],
    prefix = "/Receptionist"
)

get_db = database.get_db

