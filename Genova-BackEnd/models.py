from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):
    first_name: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ImageGenRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "3:4"
    style: Optional[str] = "Photorealistic"

class ImageResponse(BaseModel):
    image_url: str
    prompt: str
    aspect_ratio: Optional[str] = None
    style: Optional[str] = None

class Collection(BaseModel):
    name: str
    description: Optional[str] = ""
    
class ImageUpdate(BaseModel):
    is_favorite: Optional[bool] = None
    collection_id: Optional[str] = None
    is_public: Optional[bool] = None

class CreditUpdate(BaseModel):
    credits: int

class PlanRequest(BaseModel):
    name: str
    email: str
    phone: str
    plan_name: str

class ApproveRequestData(BaseModel):
    plan_name: str
    months: int