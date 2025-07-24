from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO  # Ultralytics handles YOLO11
import cv2
import numpy as np
from PIL import Image
import io

app = FastAPI()

# CORS middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO11 model 
model = YOLO('best.pt')  # or yolo11s.pt, yolo11m.pt, yolo11l.pt, yolo11x.pt

@app.post("/detect")
async def detect_produce(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    image_array = np.array(image)
    
    # YOLO11 inference 
    results = model(image_array)
    
    # Parse results 
    detections = []
    for result in results:
        boxes = result.boxes
        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = box.conf[0].item()
                class_id = int(box.cls[0].item())
                class_name = model.names[class_id]
                
                detections.append({
                    "bbox": [x1, y1, x2, y2],
                    "confidence": confidence,
                    "class": class_name,
                    "class_id": class_id
                })
    
    return {
        "detections": detections,
        "image_shape": image_array.shape[:2]
    }