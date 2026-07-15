from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from database import users_collection, requests_collection
from models import User, Token, CreditUpdate, PlanRequest, ApproveRequestData  # ← Ye import fixed – models.py se User aur Token
from bson import ObjectId
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
        "credits": 12,
        "current_plan": "Free"
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
    current_plan = current_user.get("current_plan", "Free")
    plan_months = current_user.get("plan_months", 0)
    return {
        "first_name": current_user.get("first_name"),
        "email": current_user.get("email"),
        "credits": credits,
        "current_plan": current_plan,
        "plan_months": plan_months
    }

@router.post("/decrement-credit")
async def decrement_credit(current_user: dict = Depends(get_current_user)):
    users_collection.update_one(
        {"email": current_user["email"]},
        {"$inc": {"credits": -1}}
    )
    user = users_collection.find_one({"email": current_user["email"]})
    return {"credits": user["credits"]}

@router.get("/users")
async def get_all_users():
    users_cursor = users_collection.find({})
    users = []
    for u in users_cursor:
        users.append({
            "id": str(u["_id"]),
            "first_name": u.get("first_name", ""),
            "email": u.get("email", ""),
            "credits": u.get("credits", 0)
        })
    return users

@router.put("/users/{user_id}/credits")
async def update_user_credits(user_id: str, credit_update: CreditUpdate):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    result = users_collection.update_one(
        {"_id": obj_id},
        {"$set": {"credits": credit_update.credits}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Credits updated successfully"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    result = users_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.post("/requests")
async def create_plan_request(plan_req: PlanRequest):
    new_req = {
        "name": plan_req.name,
        "email": plan_req.email,
        "phone": plan_req.phone,
        "plan_name": plan_req.plan_name,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    result = requests_collection.insert_one(new_req)
    return {"message": "Request submitted successfully", "id": str(result.inserted_id)}

@router.get("/requests")
async def get_all_requests():
    reqs_cursor = requests_collection.find({}).sort("created_at", -1)
    reqs = []
    for r in reqs_cursor:
        reqs.append({
            "id": str(r["_id"]),
            "name": r.get("name", ""),
            "email": r.get("email", ""),
            "phone": r.get("phone", ""),
            "plan_name": r.get("plan_name", ""),
            "status": r.get("status", ""),
            "created_at": r.get("created_at", datetime.utcnow()).isoformat()
        })
    return reqs

@router.put("/requests/{req_id}/approve")
async def approve_plan_request(req_id: str, data: ApproveRequestData):
    try:
        obj_id = ObjectId(req_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")
    
    req = requests_collection.find_one({"_id": obj_id})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if req.get("status") == "approved":
        return {"message": "Request is already approved"}
        
    plan_name = data.plan_name.lower()
    credits_to_add = 0
    if "lite" in plan_name:
        credits_to_add = 300 * data.months
    elif "pro" in plan_name:
        credits_to_add = 1500 * data.months
    elif "enterprise" in plan_name:
        credits_to_add = 9999 * data.months
        
    user = users_collection.find_one({"email": req.get("email")})
    if user:
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"current_plan": data.plan_name, "plan_months": data.months}, "$inc": {"credits": credits_to_add}}
        )
    
    requests_collection.update_one({"_id": obj_id}, {"$set": {"status": "approved", "plan_name": data.plan_name, "months": data.months}})
    
    return {"message": "Plan request approved and user updated"}