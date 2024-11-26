from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas
from typing import List, Optional

def get_all_payments(db: Session,
                    bill_id: Optional[int] = Query(None),
                    type: Optional[str] = Query(None)):
    all_payments=db.query(models.Payment)
    if bill_id:
       all_payments=all_payments.filter(models.Payment.bill_id==bill_id)
    if type:
        all_payments=all_payments.filter(models.Payment.type==type)
    return all_payments
''''
SELECT * 
FROM Payment
WHERE (bill_id = bill_id)
  AND (type = type);
'''



def make_payment(request:schemas.Payment, db:Session):
    try:
        new_payment= models.Payment(amount=request.amount,type=request.type,bill_id=request.bill_id)
        db.add(new_payment)
        db.commit()

        curr_bill = db.query(models.Bill).filter(models.Bill.id==new_payment.bill_id).first()
        curr_bill.total_amount = curr_bill.total_amount+request.amount
        db.commit()

        db.refresh(new_payment)
        return new_payment
    except Exception as e:
        # Rollback the transaction in case of any failure
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Close the database session
        db.close()    

'''''
DECLARE
    v_bill_id NUMBER;
    v_total_amount NUMBER;
BEGIN
    INSERT INTO Payment (amount, type, bill_id) 
    VALUES (amount_value, type_value, bill_id_value)
    RETURNING bill_id INTO v_bill_id;

    SELECT total_amount 
    INTO v_total_amount
    FROM Bill 
    WHERE id = v_bill_id;

    UPDATE Bill
    SET total_amount = v_total_amount + amount_value
    WHERE id = v_bill_id;
    
    COMMIT;
END;
/
'''