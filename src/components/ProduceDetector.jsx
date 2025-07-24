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
      
      console.log('Sending request to backend...');
      
      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Detection result:', result);
      setDetections(result.detections);
      
      // Stop webcam after capture
      stopWebcam();
    } catch (err) {
      console.error('Detection error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to backend server. Make sure it\'s running on http://localhost:8000');
      } else if (err.name === 'TimeoutError') {
        setError('Request timed out. The server may be processing a large image.');
      } else {
        setError('Error detecting produce: ' + err.message);
      }
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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '32px',
        color: '#374151'
      }}>
        Produce Detection
      </h1>
      
      {/* Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {!isWebcamActive ? (
          <button
            onClick={startWebcam}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <Camera size={20} />
            Start Camera
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={captureImage}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: isLoading ? '#9CA3AF' : '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              <Camera size={20} />
              Capture
            </button>
            <button
              onClick={stopWebcam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Stop Camera
            </button>
          </div>
        )}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: isLoading ? '#9CA3AF' : '#8B5CF6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          <Upload size={20} />
          Upload Image
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        {(imageData || detections.length > 0) && (
          <button
            onClick={() => {
              setImageData(null);
              setDetections([]);
              setError('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <RefreshCw size={20} />
            Clear
          </button>
        )}
      </div>
      
      {/* Camera View */}
      {isWebcamActive && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              maxWidth: '500px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      )}
      
      {/* Loading */}
      {isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '16px',
          backgroundColor: '#EFF6FF',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Loader2 className="animate-spin" size={20} />
          <span>Detecting produce...</span>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#DC2626', margin: 0 }}>{error}</p>
        </div>
      )}
      
      {/* Results */}
      {imageData && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>Detection Results</h2>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
            gap: '24px'
          }}>
            {/* Image with bounding boxes */}
            <div style={{ flex: 1 }}>
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            
            {/* Detection list */}
            <div style={{ width: window.innerWidth < 1024 ? '100%' : '320px' }}>
              <h3 style={{
                fontWeight: '600',
                marginBottom: '8px'
              }}>Detected Items ({detections.length})</h3>
              <div style={{
                maxHeight: '240px',
                overflowY: 'auto'
              }}>
                {detections.map((detection, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {detection.class}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>
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