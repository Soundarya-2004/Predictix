import requests
import time
import random
import math
from datetime import datetime

# Configuration
API_URL = "http://localhost:5000/api/ingest"
MACHINE_IDS = [
    "6623e1a2c3d4e5f6a7b8c9d0", # Pump #4
    "6623e1a2c3d4e5f6a7b8c9d1", # Motor #2
    "6623e1a2c3d4e5f6a7b8c9d2"  # Conveyor
]

def generate_realistic_data(machine_id, step):
    # Use sine wave for periodic fluctuations + noise
    base_temp = 65 if "d0" in machine_id else 75 if "d1" in machine_id else 55
    temp = base_temp + 5 * math.sin(step / 10) + random.uniform(-1, 1)
    
    vib_base = 2.0 if "d0" in machine_id else 4.0 if "d1" in machine_id else 1.5
    vib = vib_base + 0.5 * math.sin(step / 5) + random.uniform(-0.2, 0.2)
    
    # Simulate a "spike" every now and then
    if random.random() > 0.95:
        temp += 10
        vib += 2

    return {
        "machineId": machine_id,
        "temperature": round(temp, 2),
        "vibration": round(vib, 2),
        "rpm": round(random.uniform(1500, 1600), 0),
        "pressure": round(random.uniform(90, 110), 2),
        "timestamp": datetime.now().isoformat()
    }

def simulate():
    print("🚀 Predictix Professional IoT Simulator Active")
    print(f"📡 Broadcasting to: {API_URL}")
    step = 0
    while True:
        for mid in MACHINE_IDS:
            data = generate_realistic_data(mid, step)
            try:
                response = requests.post(API_URL, json=data, timeout=2)
                if response.status_code == 200:
                    print(f"✅ [{datetime.now().strftime('%H:%M:%S')}] Data sent for {mid[:8]}... | Temp: {data['temperature']}°C | Vib: {data['vibration']}mm/s")
                else:
                    print(f"❌ Failed to send for {mid}: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Connection Error: {e}")
        
        step += 1
        time.sleep(3) # Faster updates for better visualization

if __name__ == "__main__":
    simulate()
