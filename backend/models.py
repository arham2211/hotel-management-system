from database import Base
from sqlalchemy import Column, Integer, String, Boolean

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)


class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    password = Column(String)

    

class Staff(Base):
    __tablename__ = "Staff"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String) 
    type = Column(String)
    

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer)
    booked_status = Column (Boolean)

class RoomCategory(Base):
    __tablename__="RoomCategory"
    id = Column(Integer, primary_key=True, index=True) 
    type = Column(String)
    price = Column(Integer)
    beds = Column(Integer)
    baths = Column(Integer)
    image = Column(String)
    rating = Column(Integer)
    description = Column(String)
