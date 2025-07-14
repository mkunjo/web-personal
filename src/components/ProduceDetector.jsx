import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Loader2, RefreshCw } from 'lucide-react';

const ProduceDetector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [detections, setDetections] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start webcam
  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      setStream(mediaStream);
      setIsWebcamActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Failed to access camera: ' + err.message);
    }
  }, []);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsWebcamActive(false);
    }
  }, [stream]);

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        detectProduce(blob);
      }
    }, 'image/jpeg', 0.8);
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      detectProduce(file);
    }
  };

  // Send image to backend for detection
  const detectProduce = async (imageFile) => {
    setIsLoading(true);
    setError('');
    
    // Create preview of image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target.result);
    };
    reader.readAsDataURL(imageFile);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Detection failed');
      }
      
      const result = await response.json();
      setDetections(result.detections);
      
      // Stop webcam after capture
      stopWebcam();
    } catch (err) {
      setError('Error detecting produce: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw bounding boxes on canvas
  React.useEffect(() => {
    if (!imageData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Draw bounding boxes
      detections.forEach((detection, index) => {
        const [x1, y1, x2, y2] = detection.bbox;
        const width = x2 - x1;
        const height = y2 - y1;
        
        // Generate consistent color for each class
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const color = colors[detection.class_id % colors.length];
        
        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x1, y1, width, height);
        
        // Draw label background
        ctx.fillStyle = color;
        const label = `${detection.class} (${(detection.confidence * 100).toFixed(1)}%)`;
        const textMetrics = ctx.measureText(label);
        ctx.fillRect(x1, y1 - 25, textMetrics.width + 10, 25);
        
        // Draw label text
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(label, x1 + 5, y1 - 8);
      });
    };
    
    img.src = imageData;
  }, [imageData, detections]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Produce Detection
      </h1>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {!isWebcamActive ? (
          <button
            onClick={startWebcam}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Camera size={20} />
            Start Camera
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={captureImage}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Camera size={20} />
              Capture
            </button>
            <button
              onClick={stopWebcam}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop Camera
            </button>
          </div>
        )}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          <Upload size={20} />
          Upload Image
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {(imageData || detections.length > 0) && (
          <button
            onClick={() => {
              setImageData(null);
              setDetections([]);
              setError('');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RefreshCw size={20} />
            Clear
          </button>
        )}
      </div>
      
      {/* Camera View */}
      {isWebcamActive && (
        <div className="mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
          />
        </div>
      )}
      
      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg mb-6">
          <Loader2 className="animate-spin" size={20} />
          <span>Detecting produce...</span>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Results */}
      {imageData && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image with bounding boxes */}
            <div className="flex-1">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border rounded-lg shadow-md"
              />
            </div>
            
            {/* Detection list */}
            <div className="lg:w-80">
              <h3 className="font-semibold mb-2">Detected Items ({detections.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {detections.map((detection, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="font-medium text-gray-800">
                      {detection.class}
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence: {(detection.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduceDetector;