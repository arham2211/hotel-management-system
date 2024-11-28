from sqlalchemy.orm import Session, joinedload
from fastapi import Depends,HTTPException,status
from sqlalchemy import func

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
'''
SELECT * 
FROM Bill
WHERE (bill_id_param IS NULL OR id = bill_id_param)
  AND (user_id_param IS NULL OR user_id = user_id_param);

'''


def show_detailed_bill_info(db: Session, bill_id: Optional[int] = None, user_id: Optional[int] = None):
    # Fetch bills based on the filters
    query = db.query(models.Bill).join(
        models.User, models.Bill.user_id==models.User.id).join(
            models.Payment, models.Bill.id == models.Payment.bill_id).join (
                models.Booking, models.Bill.id == models.Booking.bill_id) 

    if bill_id:
        query = query.filter(models.Bill.id == bill_id)
    if user_id:
        query = query.filter(models.Bill.user_id == user_id)
    bills = query.all()

    return bills

'''
SELECT b.*, u.*, p.*, bo.*
FROM Bill b
JOIN User u ON b.user_id = u.id
JOIN Payment p ON b.id = p.bill_id
JOIN Booking bo ON b.id = bo.bill_id
WHERE (bill_id_param IS NULL OR b.id = bill_id_param)
  AND (user_id_param IS NULL OR b.user_id = user_id_param);

'''


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
'''
DECLARE
    v_new_bill_id NUMBER;
BEGIN
    -- Insert a new bill
    INSERT INTO Bill (user_id, first_name, last_name, phone_number, total_amount)
    VALUES (user_id_param, first_name_param, last_name_param, phone_number_param, 0)
    RETURNING id INTO v_new_bill_id;

    SELECT * INTO new_bill_details FROM Bill WHERE id = v_new_bill_id;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

'''

def updateBill(id: int, 
               total_amount: Optional[int] = None, 
               first_name: Optional[str] = None, 
               last_name: Optional[str] = None, 
               phone_number: Optional[str] = None, 
               db: Session=Depends):

    # Fetch the bill record by its ID
    bill = db.query(models.Bill).filter(models.Bill.id == id).first()

    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill ID not found")   
    
    # Update the bill fields if they are provided
    if total_amount is not None:
        bill.total_amount = total_amount
    if first_name:
        bill.first_name = first_name
    if last_name:
        bill.last_name = last_name
    if phone_number:
        bill.phone_number = phone_number
    
    # Commit the changes to the database
    db.commit()
    db.refresh(bill)
    return bill

def delete_bill(id, db:Session):
    bill=db.query(models.Bill).filter(models.Bill.id==id).first()
    db.delete(bill)
    db.commit()

    return {"Detail":"Deleted Successfully."}


def getMaxBill(db: Session):
    # Subquery to find the maximum total_amount
    max_total_amount = db.query(func.max(models.Bill.total_amount)).scalar()

    # Query to find the bill_id and user_id with the maximum total_amount
    max_bill = db.query(
        models.Bill.id.label('bill_id'),
        models.Bill.user_id,
        models.Bill.total_amount
    ).filter(models.Bill.total_amount == max_total_amount).first()

    return max_bill


def getTotalAmountSum(db: Session):
    # Use SUM() aggregate function to calculate the total sum of the total_amount column
    total_sum = db.query(func.sum(models.Bill.total_amount)).scalar()
    return total_sum

#SELECT SUM(total_amount) AS total_sum FROM bills;

