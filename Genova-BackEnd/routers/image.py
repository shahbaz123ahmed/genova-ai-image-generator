from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user
from database import db
from models import ImageGenRequest, ImageResponse
import urllib.parse
import time
from datetime import datetime
from bson import ObjectId

router = APIRouter()
images_collection = db["images"]

@router.post("/generate", response_model=ImageResponse)
async def generate_image(request: ImageGenRequest, current_user: dict = Depends(get_current_user)):
    """Generate an AI image using Pollinations.ai"""
    try:
        print(f"🎨 Generating image for: {request.prompt}")
        print(f"🎭 Style: {request.style}")
        
        # Build enhanced prompt
        full_prompt = f"{request.prompt}, {request.style} style, high quality, detailed, masterpiece"
        
        # Encode prompt for URL
        encoded_prompt = urllib.parse.quote(full_prompt)
        
        # Use provided seed or generate new one
        seed = request.seed if hasattr(request, 'seed') and request.seed else int(time.time() * 1000) % 1000000
        
        # Pollinations.ai
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={seed}&nologo=true&enhance=true"
        
        print(f"✅ Image generated successfully! Seed: {seed}")
        
        return {
            "image_url": image_url,
            "prompt": request.prompt,
            "style": request.style
        }
        
    except Exception as e:
        print(f"❌ Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/save-image")
async def save_image(image_data: ImageResponse, current_user: dict = Depends(get_current_user)):
    """Save generated image to user's history"""
    try:
        image_doc = {
            "user_email": current_user["email"],
            "image_url": image_data.image_url,
            "prompt": image_data.prompt,
            "style": image_data.style,
            "created_at": datetime.utcnow().isoformat(),
        }
        
        result = images_collection.insert_one(image_doc)
        print(f"✅ Image saved with ID: {result.inserted_id}")
        return {"msg": "Image saved", "id": str(result.inserted_id)}
    except Exception as e:
        print(f"❌ Save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    """Get user's image generation history"""
    try:
        images = list(images_collection.find({
            "user_email": current_user["email"]
        }).sort("created_at", -1))
        
        for img in images:
            img["_id"] = str(img["_id"])
        
        return {"images": images}
    except Exception as e:
        print(f"❌ History fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete-image/{image_id}")
async def delete_image(image_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an image from history"""
    try:
        result = images_collection.delete_one({
            "_id": ObjectId(image_id),
            "user_email": current_user["email"]
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")
        
        print(f"✅ Image deleted: {image_id}")
        return {"msg": "Image deleted"}
    except Exception as e:
        print(f"❌ Delete error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))