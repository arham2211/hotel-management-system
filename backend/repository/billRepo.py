from sqlalchemy.orm import Session, joinedload
import database, models, schemas
from typing import Optional

def show_only_bill_info(db:Session,
                        bill_id: Optional[int]=None,
                         user_id:Optional[int]=None):
    bill = db.query(models.Bill)
    if bill_id:
        bill = bill.filter(models.Bill.id==bill_id)
    if user_id:
        bill = bill.filter(models.Bill.user_id==user_id)
    return bill


#from sqlalchemy.orm import joinedload

def show_detailed_bill_info(db: Session, bill_id: Optional[int] = None, user_id: Optional[int] = None):
    query = db.query(models.Bill,
         models.Booking.start_date  # Include start_date from Booking
     ).join(
         models.Booking, models.Bill.id == models.Booking.bill_id  # Join on user_id (or appropriate key)
     )
    
    if bill_id:
        query = query.filter(models.Bill.id == bill_id)
    if user_id:
        query = query.filter(models.Bill.user_id == user_id)
    
    result = query.all()

    # Map the result to schema objects
    detailed_bills = []
    for bill, start_date in result:
        detailed_bills.append(
            schemas.ShowBillDetails(
                id=bill.id,
                user_id=bill.user_id,
                total_amount=bill.total_amount,
                first_name=bill.first_name,
                last_name=bill.last_name,
                phone_number=bill.phone_number,
                customer=bill.customer,  # Assuming customer is retrieved via relationship
                all_payments=bill.all_payments,  # Assuming all_payments is retrieved via relationship
                start_date=start_date  # Include the start_date from the query
            )
        )
    
    return detailed_bills
    #return result


def add_new_bill(request:schemas.addBill,db:Session):
    newBill=models.Bill(user_id=request.user_id,
                        first_name=request.first_name,
                        last_name=request.last_name,
                        phone_number=request.phone_number,
                        total_amount=0)
    db.add(newBill)
    db.commit()
    db.refresh(newBill)
    return newBill