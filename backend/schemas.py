from pydantic import BaseModel, Field
from datetime import date

class User(BaseModel):
    username: str
    email: str
    password: str

class Staff(BaseModel):
    username: str
    email: str
    password: str
    type: str

class Login(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role:str


class TokenData(BaseModel):
    username: str | None = None


class Admin(BaseModel):
    email: str
    password: str


class RoomCategory(BaseModel):
    type: str
    description: str
    price: int
    beds: int
    baths: int
    image: str
    rating: int = Field(..., ge=1, le=5) 

class ShowRoomCat(RoomCategory):
    type: str
    description: str
    price: int
    beds: int
    baths: int
    image: str
    rating: int = Field(..., ge=1, le=5) 

    class Config:
        from_attributes = True

class Rooms(BaseModel):
    id: int
    category_id: int
    booked_status: bool

class ShowRooms(Rooms):
    category: ShowRoomCat

class Booking(BaseModel):
    id: int
    room_id: int
    user_id: int
    start_date: date
    end_date: date
    payment_id: int

    class Config:
        orm_mode = True
