from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from database import users_collection
from models import User, Token  # ← Ye import fixed – models.py se User aur Token
from utils import get_password_hash, create_access_token

load_dotenv()
router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")  # Bcrypt skip, pbkdf2 use
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
SECRET_KEY = os.getenv("JWT_SECRET", "fallback_secret_key_if_missing")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

class UserInDB(BaseModel):
    email: str
    hashed_password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/signup")
async def signup(user: User):
    db_user = users_collection.find_one({"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    result = users_collection.insert_one({
        "first_name": user.first_name,
        "email": user.email,
        "hashed_password": hashed_password,
        "credits": 10
    })
    print("Inserted user ID:", result.inserted_id)
    # Generate token for the new user
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Pehle email se user dhundo (case insensitive bana diya lower() se – better practice)
    user = users_collection.find_one({"email": form_data.username.lower()})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Ab password check karo
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Success – token banao
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

@router.get("/me", response_model=dict)
async def get_profile(current_user: dict = Depends(get_current_user)):
    credits = current_user["credits"] if "credits" in current_user else 0
    return {
        "first_name": current_user.get("first_name"),
        "email": current_user.get("email"),
        "credits": credits
    }

@router.post("/decrement-credit")
async def decrement_credit(current_user: dict = Depends(get_current_user)):
    users_collection.update_one(
        {"email": current_user["email"]},
        {"$inc": {"credits": -1}}
    )
    user = users_collection.find_one({"email": current_user["email"]})
    return {"credits": user["credits"]}