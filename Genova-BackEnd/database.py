import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # .env load karega
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in .env! Check your setup.")

client = MongoClient(MONGODB_URI)
db = client["ai_gen_db"]
users_collection = db["users"]
images_collection = db["images"]
requests_collection = db["requests"]

# Test connection (optional, comment out if issues)
try:
    client.admin.command('ping')
    print("MongoDB connected successfully!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")