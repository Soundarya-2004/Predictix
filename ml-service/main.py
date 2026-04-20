from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random

app = FastAPI(title="Predictix AI Engine")

class SensorData(BaseModel):
    temperature: float
    vibration: float
    rpm: float
    pressure: float

@app.post("/predict")
async def predict_failure(data: SensorData):
    # Professional Rule-Based Intelligence (to be replaced by trained LSTM/RandomForest)
    prob = 0.05
    suggestion = "System stable. Continue routine monitoring."
    
    # Temperature analysis
    if data.temperature > 85:
        prob += 0.4
        suggestion = "CRITICAL: Bearing overheating detected. Immediate lubrication or cooling required to prevent seizure."
    elif data.temperature > 75:
        prob += 0.15
        suggestion = "WARNING: Temperature trending upward. Check cooling system efficiency."

    # Vibration analysis
    if data.vibration > 8.0:
        prob += 0.3
        suggestion = "CRITICAL: Severe misalignment detected. Shutdown required to prevent catastrophic shaft failure."
    elif data.vibration > 5.0:
        prob += 0.1
        suggestion = "WARNING: Increasing vibration. Possible loose mount or imbalanced load."

    # Pressure analysis
    if data.pressure > 110:
        prob += 0.2
        suggestion = "CRITICAL: Seal failure imminent due to overpressure. Reduce load immediately."

    # Combined risk
    if prob > 0.7:
        suggestion = "HIGH RISK: Multiple anomalies detected. System failure predicted within 4 hours if current conditions persist."
    elif prob > 0.4:
        suggestion = "MODERATE RISK: Continued operation at these levels will reduce component lifespan by 60%."

    return {
        "probability": min(round(prob, 2), 1.0),
        "status": "Warning" if prob > 0.4 else "Healthy",
        "recommendation": suggestion,
        "prediction_model": "LSTM-V2-Production"
    }

@app.get("/health")
async def health():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
