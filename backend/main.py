from fastapi import FastAPI
import models
from database import engine
from routers import users, authentication, rooms, admin, booking,bill,payment,party,tour,cardDetails,staff
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.Base.metadata.create_all(bind = engine) 
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(authentication.router)
app.include_router(admin.router)
app.include_router(bill.router)
app.include_router(booking.router)
app.include_router(cardDetails.router)
app.include_router(party.router)
app.include_router(payment.router)
app.include_router(rooms.router)
app.include_router(staff.router)
app.include_router(tour.router)
app.include_router(users.router)

