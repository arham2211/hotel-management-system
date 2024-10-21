from pydantic import BaseModel, Field


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

class ShowRoom(RoomCategory):
    type: str
    description: str
    price: int
    beds: int
    baths: int
    image: str
    rating: int = Field(..., ge=1, le=5) 

    class Config:
        from_attributes = True