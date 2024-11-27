from fastapi import  Depends, status, HTTPException
from sqlalchemy.orm import Session
from hashing import Hash
import  models, schemas


def getUserId(username: str, db: Session):
    user_id = db.query(models.User).filter(models.User.username==username).first()
    if not user_id:
        user_id = db.query(models.User).filter(models.User.email==username).first()
    return user_id.id

#equivalent sql query:
# SELECT id  FROM User
# WHERE username = username
# If no results are found in the first query, run the second query to check email:
# SELECT id FROM User
# WHERE email = username



def getUserInfo(id:int, db:Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# SELECT * FROM User 
# WHERE id =id 


def deleteUser(id:int, db:Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = "User not found")
    
    db.delete(user)
    db.commit()
    return {"detail": "Deleted Successfully."}

# DELETE FROM User WHERE id = id;
# COMMIT;

def updateUser(request:schemas.updateUser, db:Session):
    user=db.query(models.User).filter(models.User.username==request.old_username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = "User not found")   
    
    # Update the user fields if they are provided
    if request.new_username:
        user.username = request.new_username
    if request.new_email:
        user.email = request.new_email
    if request.new_password:
        user.password = Hash.get_password_hash(request.new_password)  # Make sure to hash the password if necessary
    
    # Commit the changes to the database
    db.commit()
    db.refresh(user)
    return user
'''
-- Assume the user exists
UPDATE users
SET username = NVL('new_username', username),
    email = NVL('new_email', email),
    password = NVL('hashed_new_password', password)
WHERE username = 'old_username';
'''