from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)

    current_booking = relationship("Booking", back_populates='associated_user') 

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
    __tablename__ = "Rooms"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer,ForeignKey('RoomCategory.id'))
    booked_status = Column(Boolean, default=False, nullable=False)

    category = relationship("RoomCategory", back_populates='rooms')
    current_booking = relationship("Booking", back_populates='associated_room')

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

    rooms = relationship("Room", back_populates='category')



class Booking(Base):
    __tablename__ = "Booking"
    id = Column(Integer, primary_key=True, index=True) 
    room_id = Column(Integer, ForeignKey('Rooms.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    start_date = Column(Date)
    end_date = Column(Date)
    payment_id = Column(Integer,ForeignKey('Payment.id'))

    associated_user = relationship("User", back_populates='current_booking') 
    associated_room = relationship("Room", back_populates='current_booking')
    associated_payment = relationship("Payment", back_populates="associated_booking")



class Payment(Base):
    __tablename__ = "Payment"
    id = Column(Integer, primary_key=True, index=True) 
    amount = Column(Integer)
    type = Column(String)
    bill_id = Column(Integer)
    associated_booking = relationship("Booking", back_populates="associated_payment")

