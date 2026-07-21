from fastapi import APIRouter, Depends, HTTPException, Request
from routers.auth import get_current_user
from database import db
from models import ImageGenRequest, ImageResponse
import requests
import os
import uuid
from datetime import datetime
import urllib.parse

router = APIRouter()
images_collection = db["images"]

@router.post("/generate", response_model=ImageResponse)
async def generate_image(request_obj: Request, request: ImageGenRequest, current_user: dict = Depends(get_current_user)):
    """Generate an AI image using Cloudflare Workers AI or fallback to Pollinations.ai"""
    try:
        print(f"🎨 Generating image for: {request.prompt}")
        print(f"📐 Aspect Ratio: {request.aspect_ratio}, Style: {request.style}")
        
        # Build enhanced prompt with style
        full_prompt = f"{request.prompt}, {request.style} style, high quality, detailed"
        
        cf_account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        cf_api_key = os.getenv("CLOUDFLARE_API_KEY")
        
        # Check if Cloudflare credentials are set and not the placeholder text
        if (cf_account_id and cf_api_key and 
            "placeholder" not in cf_account_id.lower() and 
            "placeholder" not in cf_api_key.lower() and
            len(cf_account_id.strip()) > 0 and 
            len(cf_api_key.strip()) > 0):
            try:
                print("⚡ Using Cloudflare Workers AI (stable-diffusion-xl-lightning)...")
                headers = {"Authorization": f"Bearer {cf_api_key}"}
                model = "@cf/bytedance/stable-diffusion-xl-lightning"
                url = f"https://api.cloudflare.com/client/v4/accounts/{cf_account_id}/ai/run/{model}"
                
                response = requests.post(url, headers=headers, json={"prompt": full_prompt}, timeout=30)
                
                if response.status_code == 200:
                    os.makedirs("static", exist_ok=True)
                    filename = f"cf_{uuid.uuid4().hex}.png"
                    filepath = os.path.join("static", filename)
                    with open(filepath, "wb") as f:
                        f.write(response.content)
                    
                    # Construct base url dynamically from request
                    base_url = str(request_obj.base_url)
                    image_url = f"{base_url}static/{filename}"
                    print(f"✅ Cloudflare Image generated & saved: {image_url}")
                    
                    return {
                        "image_url": image_url,
                        "prompt": request.prompt,
                        "aspect_ratio": request.aspect_ratio,
                        "style": request.style
                    }
                else:
                    print(f"⚠️ Cloudflare failed with code {response.status_code}: {response.text}")
                    # fallback to pollinations if CF returns error
            except Exception as cf_err:
                print(f"⚠️ Cloudflare request exception: {str(cf_err)}")
                # fallback to pollinations if exception occurs
        
        # Fallback to Pollinations.ai (FREE)
        print("🌱 Falling back to Pollinations.ai...")
        encoded_prompt = urllib.parse.quote(full_prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
        print(f"✅ Pollinations Image URL generated: {image_url[:80]}...")
        
        return {
            "image_url": image_url,
            "prompt": request.prompt,
            "aspect_ratio": request.aspect_ratio,
            "style": request.style
        }
        
    except Exception as e:
        print(f"❌ Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/generate-guest", response_model=ImageResponse)
async def generate_guest_image(request_obj: Request, request: ImageGenRequest):
    """Generate an AI image for guest users without requiring authentication"""
    try:
        print(f"🎨 Guest generating image for: {request.prompt}")
        print(f"📐 Aspect Ratio: {request.aspect_ratio}, Style: {request.style}")
        
        full_prompt = f"{request.prompt}, {request.style} style, high quality, detailed"
        
        cf_account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        cf_api_key = os.getenv("CLOUDFLARE_API_KEY")
        
        if (cf_account_id and cf_api_key and 
            "placeholder" not in cf_account_id.lower() and 
            "placeholder" not in cf_api_key.lower() and
            len(cf_account_id.strip()) > 0 and 
            len(cf_api_key.strip()) > 0):
            try:
                print("⚡ Using Cloudflare Workers AI (Guest)...")
                headers = {"Authorization": f"Bearer {cf_api_key}"}
                model = "@cf/bytedance/stable-diffusion-xl-lightning"
                url = f"https://api.cloudflare.com/client/v4/accounts/{cf_account_id}/ai/run/{model}"
                
                response = requests.post(url, headers=headers, json={"prompt": full_prompt}, timeout=30)
                
                if response.status_code == 200:
                    os.makedirs("static", exist_ok=True)
                    filename = f"cf_{uuid.uuid4().hex}.png"
                    filepath = os.path.join("static", filename)
                    with open(filepath, "wb") as f:
                        f.write(response.content)
                    
                    base_url = str(request_obj.base_url)
                    image_url = f"{base_url}static/{filename}"
                    print(f"✅ Guest Cloudflare Image generated & saved: {image_url}")
                    
                    return {
                        "image_url": image_url,
                        "prompt": request.prompt,
                        "aspect_ratio": request.aspect_ratio,
                        "style": request.style
                    }
                else:
                    print(f"⚠️ Cloudflare failed with code {response.status_code}: {response.text}")
            except Exception as cf_err:
                print(f"⚠️ Cloudflare request exception: {str(cf_err)}")
        
        print("🌱 Falling back to Pollinations.ai for Guest...")
        encoded_prompt = urllib.parse.quote(full_prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
        print(f"✅ Guest Pollinations Image URL generated: {image_url[:80]}...")
        
        return {
            "image_url": image_url,
            "prompt": request.prompt,
            "aspect_ratio": request.aspect_ratio,
            "style": request.style
        }
    except Exception as e:
        print(f"❌ Guest generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Guest generation failed: {str(e)}")

@router.post("/save-image")
async def save_image(image_data: ImageResponse, current_user: dict = Depends(get_current_user)):
    """Save generated image to user's history"""
    try:
        image_doc = {
            "user_email": current_user["email"],
            "image_url": image_data.image_url,
            "prompt": image_data.prompt,
            "aspect_ratio": image_data.aspect_ratio,
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
    from bson import ObjectId
    
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