import requests
import os

BASE_URL = "http://localhost:8000"

def get_token():
    # Try to login first
    resp = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "test@test.com", "password": "password"})
    if resp.status_code == 200:
        return resp.json()["access_token"]
    
    # If login fails, try register
    requests.post(f"{BASE_URL}/api/auth/register", json={
        "email": "test@test.com",
        "password": "password",
        "full_name": "Test User"
    })
    
    resp = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "test@test.com", "password": "password"})
    return resp.json()["access_token"]

token = get_token()
headers = {"Authorization": f"Bearer {token}"}

print("1. Testing Equipment Scan Endpoint...")
gym_file_path = "/Users/karuniaperjuangan/Documents/Project/Hackathon/platinum-hex-rubber-dumbbell.webp"
with open(gym_file_path, "rb") as f:
    files = {"file": ("platinum-hex-rubber-dumbbell.webp", f, "image/webp")}
    resp = requests.post(f"{BASE_URL}/api/vision/equipment", headers=headers, files=files)
    print("Status:", resp.status_code)
    print("Response:", resp.json())

print("\n2. Testing Biometrics Autofill Endpoint...")
body_file_path = "/Users/karuniaperjuangan/Documents/Project/Hackathon/Prabowo.jpg"
with open(body_file_path, "rb") as f:
    files = {"file": ("Prabowo.jpg", f, "image/jpeg")}
    resp = requests.post(f"{BASE_URL}/api/vision/estimate-biometrics", headers=headers, files=files)
    print("Status:", resp.status_code)
    print("Response:", resp.json())
