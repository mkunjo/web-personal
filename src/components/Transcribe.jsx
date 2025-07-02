import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/tech.css'; 

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const Transcribe = () => {
  const [imageText, setImageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [webcamError, setWebcamError] = useState('');
  const [processingInfo, setProcessingInfo] = useState('');
  const [fileType, setFileType] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const handlePaste = (event) => {
      const clipboardItems = event.clipboardData?.items;
      if (!clipboardItems) return;

      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.indexOf('image') === 0) {
          const file = item.getAsFile();
          if (file) {
            handleFileUpload({ target: { files: [file] } });
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File validation
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (!isImage && !isPDF) {
      setError('Please select an image file or PDF.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit for PDFs
      setError('File size too large. Please select a smaller file (max 50MB).');
      return;
    }

    setError('');
    setLoading(true);
    setProgress(0);
    setProcessingInfo('');
    setFileType(isPDF ? 'PDF' : 'Image');

    try {
      if (isPDF) {
        await handlePDFUpload(file);
      } else {
        await handleImageProcessing(file);
      }
    } catch (err) {
      setError(`Failed to process file: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingInfo('');
    }
  };

  const handleImageProcessing = async (file) => {
    setProcessingInfo('Processing image...');
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      }
    });
    setImageText(text);
  };

  const handlePDFUpload = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    setProcessingInfo(`Processing PDF (${numPages} pages)...`);

    let extractedText = '';
    let hasTextContent = false;

    // First, try to extract text directly from PDF
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      setProgress(Math.round((pageNum / numPages) * 50)); // First 50% for text extraction

      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      if (textContent.items.length > 0) {
        hasTextContent = true;
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .trim();

        if (pageText) {
          extractedText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
        }
      }
    }

    // If no text content found or very little text, use OCR on rendered pages
    if (!hasTextContent || extractedText.trim().length < 50) {
      setProcessingInfo('PDF appears to be scanned. Using OCR...');
      extractedText = await performOCROnPDF(pdf, numPages);
    }

    setImageText(extractedText);
  };

  const performOCROnPDF = async (pdf, numPages) => {
    let ocrText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      setProcessingInfo(`OCR processing page ${pageNum} of ${numPages}...`);
      setProgress(50 + Math.round(((pageNum - 1) / numPages) * 50)); // Second 50% for OCR

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert canvas to blob for Tesseract
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });

      // Perform OCR on the page
      const { data: { text } } = await Tesseract.recognize(blob, 'eng', {
        logger: () => { } // Disable individual page logging to avoid confusion
      });

      if (text.trim()) {
        ocrText += `--- Page ${pageNum} ---\n${text}\n\n`;
      }
    }

    return ocrText;
  };

  const handleImageUpload = async (event) => {
    // This function is kept for backward compatibility but now calls handleFileUpload
    await handleFileUpload(event);
  };

  const captureFromWebcam = async () => {
    if (!webcamRef.current) {
      setError('Webcam not available.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError('Failed to capture image from webcam.');
      return;
    }

    setError('');
    setLoading(true);
    setProgress(0);
    setFileType('Webcam');
    setProcessingInfo('Processing webcam capture...');

    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      setImageText(text);
    } catch (err) {
      setError(`Failed to recognize text: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingInfo('');
    }
  };

  const handleWebcamError = (error) => {
    setWebcamError('Unable to access webcam. Please check your camera permissions.');
    console.error('Webcam error:', error);
  };

  const clearResults = () => {
    setImageText('');
    setError('');
    setWebcamError('');
    setProgress(0);
    setProcessingInfo('');
    setFileType('');
  };

  const toggleWebcam = () => {
    setShowWebcam(!showWebcam);
    if (showWebcam) {
      // Clear webcam-related errors when hiding
      setWebcamError('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(imageText);
      // You could add a temporary success message here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="transcribe-container">
      <h2 className="transcribe-title">OCR Text Extractor</h2>

      {/* Upload File Section */}
      <div className="upload-section">
        <h3>Upload File</h3>
        <label htmlFor="file-input" className="file-input-label">
          <input
            id="file-input"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="file-input"
            aria-label="Upload image or PDF file for text extraction"
          />
        </label>
        <p className="file-formats">
          Supported formats: JPG, PNG, GIF, WebP, PDF (Max size: 50MB)
        </p>
        <p className="pdf-info">
          PDF files: Direct text extraction for text-based PDFs, OCR for scanned PDFs
        </p>
      </div>

      {/* Webcam Capture Section */}
      <div className="webcam-section">
        <div className="webcam-header">
          <h3>Webcam Capture</h3>
          <button
            onClick={toggleWebcam}
            className={`webcam-toggle-btn ${showWebcam ? 'active' : ''}`}
            aria-label={showWebcam ? 'Hide webcam' : 'Show webcam'}
          >
            {showWebcam ? 'Hide Webcam' : 'Show Webcam'}
          </button>
        </div>
        
        {showWebcam && (
          <>
            {webcamError ? (
              <div className="webcam-error">
                {webcamError}
              </div>
            ) : (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={600}
                  height={400}
                  onUserMediaError={handleWebcamError}
                  className="webcam"
                />
                <br />
                <button
                  onClick={captureFromWebcam}
                  disabled={loading}
                  className={`capture-btn ${loading ? 'disabled' : ''}`}
                  aria-label="Capture image from webcam and extract text"
                >
                  {loading ? 'Processing...' : 'Capture & Read Text'}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Loading Progress */}
      {loading && (
        <div className="loading-section">
          <p>{processingInfo || 'Processing...'}</p>
          <p>Progress: {progress}%</p>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {imageText && (
        <div className="results-section">
          <div className="results-header">
            <h3 className="results-title">
              Extracted Text {fileType && `(${fileType})`}:
            </h3>
            <div className="results-actions">
              <button
                onClick={copyToClipboard}
                className="copy-btn"
                aria-label="Copy extracted text to clipboard"
              >
                Copy
              </button>
              <button
                onClick={clearResults}
                className="clear-btn"
                aria-label="Clear extracted text results"
              >
                Clear
              </button>
            </div>
          </div>
          <pre className="extracted-text">
            {imageText}
          </pre>
          <div className="text-stats">
            Character count: {imageText.length} | Word count: {imageText.trim().split(/\s+/).filter(Boolean).length}
            {fileType === 'PDF' && ' | PDF pages processed successfully'}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-section" role="alert" aria-live="polite">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Instructions */}
      <div className="instructions-section">
        <h4 className="instructions-title">Instructions:</h4>
        <ul className="instructions-list">
          <li>Upload an image file, PDF, or use your webcam to capture text</li>
          <li>PDFs: Text-based PDFs extract text directly, scanned PDFs use OCR</li>
          <li>Ensure text is clear and well-lit for best OCR results</li>
          <li>Supported languages: English (can be extended to support more)</li>
          <li>Processing time depends on file size, type, and text complexity</li>
          <li>You can paste images directly using Ctrl+V (Cmd+V on Mac)</li>
        </ul>
      </div>
    </div>
  );
};

export default Transcribe;