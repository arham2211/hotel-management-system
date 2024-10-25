from pydantic import BaseModel, Field
from datetime import date,datetime
from typing import List, Optional

class User(BaseModel):
    username: str
    email: str 
    password: str
    first_name: Optional[str] = Field(None, example="John")  # Optional fields
    last_name: Optional[str] = Field(None, example="Doe")
    phone_number: Optional[str] = Field(None, example="123-456-7890")


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
    class Config:
        from_attributes = True

class Rooms(BaseModel):
    id: int
    category_id: int
    booked_status: bool

class ShowRooms(Rooms):
    category: ShowRoomCat


class roomCatPrice(BaseModel):
    type:str
    price:int
    class Config:  
        from_attributes = True    

class Booking(BaseModel):
    room_id: int
    user_id: int
    start_date: date
    end_date: date
    totalCost: int
    num_people: int

    class Config:
        from_attributes = True

class addBill(BaseModel):
    user_id:int
    start_date:date
    end_date:date

class makeBooking(BaseModel):
    room_cat_id: int
   # user_id:int
   # billInfo:addBill
    user_id:int
    start_date:date
    end_date:date
    totalCost: int
    num_people: int
    first_name: str
    last_name: str
    phone_number: str
    class Config:
            from_attributes = True


class Payment(BaseModel):
    amount:int
    type: str
    bill_id: int

class ShowPayment(Payment):
    class Config:
        from_attributes = True



class Manager(BaseModel):
    id:int
    name:str
    salary: int

class Staff(BaseModel):
    id:int
    name:str
    designation:str
    salary:int
    manager_id:int

class Bill(BaseModel):
    id:int
    user_id:int
    total_amount:int
    start_date:date
    end_date:date


class ShowBill(Bill):
    class Config:
        from_attributes = True


class showUser(BaseModel):
    username:str
    email:str
    first_name:Optional[str]
    last_name: Optional[str]
    phone_number: Optional[str]
    class Config:
        from_attributes = True

class ShowBillDetails(ShowBill):
    customer: showUser
    all_payments : List[ShowPayment]=[]

class PartyHalls(BaseModel):
    id : int
    capacity : int
    price : int
    available : bool


class PartyReservation(BaseModel):
    id:int
    type :str 
    hall_id :int
    user_id :int
    payment_id :int 
    start_time:datetime
    end_time :datetime

class Tour(BaseModel):
    id:int
    price:int
    location:str
    tour_guide_id:int

class TourReservation(BaseModel):
    id:int
    time:datetime
    payment_id: int 
    user_id: int
    tour_id: int

