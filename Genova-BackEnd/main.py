from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, images
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

load_dotenv()

# Ensure static directory exists
os.makedirs("static", exist_ok=True)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://genova-ai-image-generator.vercel.app",
        "https://genovaai.tech",
        "https://www.genovaai.tech"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads/profiles", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(images.router, prefix="/api", tags=["images"])

@app.get("/")
def read_root():
    return {"message": "AI Image Generator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)