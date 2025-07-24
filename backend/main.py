# main.py with debugging
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = YOLO('yolo11n.pt')  
    print("✅ Model loaded successfully!")
    print(f"📋 Model classes: {model.names}")
    print(f"🔢 Number of classes: {len(model.names)}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("📁 Available .pt files:")
    import os
    for file in os.listdir('.'):
        if file.endswith('.pt'):
            print(f"   - {file}")
    model = None

@app.get("/")
def read_root():
    return {
        "message": "Produce Detection API is running", 
        "model_loaded": model is not None,
        "model_classes": model.names if model else None
    }

@app.post("/detect")
async def detect_produce(file: UploadFile = File(...)):
    print(f"\n🔄 Processing file: {file.filename}")
    
    if model is None:
        print("❌ Model not loaded!")
        return {"error": "Model not loaded"}
    
    try:
        # Read and process image
        image_bytes = await file.read()
        print(f"📷 Image size: {len(image_bytes)} bytes")
        
        image = Image.open(io.BytesIO(image_bytes))
        print(f"🖼️  Image dimensions: {image.size}")
        
        image_array = np.array(image)
        print(f"📊 Array shape: {image_array.shape}")
        
        # Run inference
        print("🔍 Running inference...")
        results = model(image_array, conf=0.10)  # confidence threshold
        print(f"✅ Inference complete. Results: {len(results)}")
        
        detections = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                print(f"📦 Found {len(boxes)} detections")
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    confidence = box.conf[0].item()
                    class_id = int(box.cls[0].item())
                    class_name = model.names[class_id]
                    
                    print(f"  🎯 {class_name}: {confidence:.2f} at [{x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}]")
                    
                    detections.append({
                        "bbox": [x1, y1, x2, y2],
                        "confidence": confidence,
                        "class": class_name,
                        "class_id": class_id
                    })
            else:
                print("📦 No detections found")
        
        print(f"🎉 Returning {len(detections)} detections")
        return {
            "detections": detections,
            "image_shape": image_array.shape[:2]
        }
        
    except Exception as e:
        print(f"💥 Error during inference: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)