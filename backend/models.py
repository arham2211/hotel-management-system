from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)  # non-nullable
    email = Column(String, nullable=False)     # non-nullable
    password = Column(String, nullable=False)  # non-nullable
    
    # New nullable fields
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    
    # Relationships
    associated_bill = relationship("Bill", back_populates="customer")
    current_booking = relationship("Booking", back_populates="associated_user")
    PartyReservation = relationship("PartyReservation", back_populates="associated_user")
    TourReservation = relationship("TourReservation", back_populates="associated_user")
    associated_bill_user_booking = relationship("Associated_Bill_User_Booking", back_populates="user")


class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    password = Column(String)

    

class Receptionist(Base):
    __tablename__ = "Receptionist"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String) 
    salary = Column(Integer)
    Manager_id = Column(Integer,ForeignKey('Manager.id'))
    Manager = relationship("Manager", back_populates="linked_receptionist")
    

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
    num_people = Column(Integer)

    associated_user = relationship("User", back_populates='current_booking') 
    associated_room = relationship("Room", back_populates='current_booking')
    associated_payment = relationship("Payment", back_populates="associated_booking")
    associated_bill_user_booking = relationship("Associated_Bill_User_Booking", back_populates="booking")

class Bill(Base):
    __tablename__ = "Bill"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(User.id))
    total_amount = Column(Integer)

    customer = relationship("User", back_populates='associated_bill')
    all_payments=relationship("Payment", back_populates='associated_bill')
    associated_bill_user_booking = relationship("Associated_Bill_User_Booking", back_populates="bill")

class Associated_Bill_User_Booking(Base):
    __tablename__ = "Associated_Bill_User_Booking"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(User.id))
    bill_id = Column(Integer, ForeignKey(Bill.id))
    booking_id = Column(Integer, ForeignKey(Booking.id))    
    # Relationships
    user = relationship("User", back_populates="associated_bill_user_booking")
    bill = relationship("Bill", back_populates="associated_bill_user_booking")
    booking = relationship("Booking", back_populates="associated_bill_user_booking")
    

class Payment(Base):
    __tablename__ = "Payment"
    id = Column(Integer, primary_key=True, index=True) 
    amount = Column(Integer)
    type = Column(String)
    bill_id = Column(Integer,ForeignKey(Bill.id))

    associated_bill = relationship("Bill", back_populates="all_payments")
    associated_booking = relationship("Booking", back_populates="associated_payment")
    PartyReservation = relationship("PartyReservation", back_populates="associated_payment")
    TourReservation = relationship("TourReservation", back_populates='associated_payment')

class Manager(Base):
    __tablename__ = "Manager"
    id = Column(Integer, primary_key=True, index=True)
    name= Column(String)
    Salary = Column(Integer)
    linked_staff= relationship("Staff",back_populates="Manager")
    linked_receptionist = relationship("Receptionist", back_populates="Manager")

class Staff(Base):
    __tablename__ = "Staff"
    id = Column(Integer, primary_key=True, index=True)
    name= Column(String)
    designation= Column(String)
    Salary = Column(Integer)
    Manager_id = Column(Integer,ForeignKey('Manager.id'))

    linked_tour = relationship("Tour", back_populates="linked_staff")
    Manager = relationship("Manager", back_populates="linked_staff")
    


class PartyHalls(Base):
    __tablename__ = "PartyHalls"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    capacity = Column(Integer)
    price = Column(Integer)
    available = Column(Boolean)

    PartyReservation = relationship("PartyReservation",back_populates="associated_hall")

class PartyReservation(Base):
    __tablename__ = "PartyReservation"
    id = Column(Integer, primary_key=True, index=True)
    type= Column(String)
    hall_id = Column(Integer, ForeignKey(PartyHalls.id))
    user_id = Column(Integer,ForeignKey(User.id))
    payment_id = Column(Integer, ForeignKey(Payment.id))
    #date= Column(Date)
    start_time = Column(TIMESTAMP)
    end_time = Column(TIMESTAMP)
    
    associated_hall = relationship("PartyHalls",back_populates="PartyReservation")
    associated_user = relationship("User", back_populates="PartyReservation")
    associated_payment = relationship("Payment", back_populates="PartyReservation")

class Tour(Base):
    __tablename__ = "Tour"
    id = Column(Integer, primary_key=True, index=True)           
    price = Column(Integer)
    location = Column(String)
    tour_guide_id= Column(Integer,ForeignKey(Staff.id))

    linked_staff = relationship("Staff", back_populates="linked_tour")
    Reservation = relationship("TourReservation", back_populates='associated_tour')

class TourReservation(Base):
    __tablename__ = "TourReservation"
    id = Column(Integer, primary_key=True, index=True)
    time = Column(TIMESTAMP)
    payment_id = Column(Integer,ForeignKey(Payment.id))
    user_id = Column(Integer,ForeignKey(User.id))
    tour_id = Column(Integer,ForeignKey(Tour.id))

    associated_tour=relationship("Tour", back_populates="Reservation")
    associated_payment=relationship("Payment", back_populates='TourReservation')
    associated_user=relationship("User", back_populates="TourReservation")

