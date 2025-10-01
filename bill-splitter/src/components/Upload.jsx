import React, { useState, useRef } from 'react';
import { Camera, Upload as UploadIcon, ArrowLeft, Loader } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function Upload({ onNavigate, onItemsDetected }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const text = result.data.text;
      const lines = text.split('\n').filter(line => line.trim());
      const items = [];

      for (const line of lines) {
        const priceMatch = line.match(/\$?(\d+\.?\d{0,2})/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          if (price > 0 && price < 1000) {
            const itemName = line.replace(/\$?\d+\.?\d{0,2}/, '').trim() || 'Item';
            items.push({
              id: Date.now() + Math.random(),
              name: itemName,
              price: price
            });
          }
        }
      }

      onItemsDetected(items);
      onNavigate('billItems');
    } catch (error) {
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      processImage(imageData);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              color: '#51331b'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#51331b',
            margin: '0 0 0 15px',
            fontWeight: '700'
          }}>
            Scan Receipt
          </h2>
        </div>

        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader size={48} style={{ 
              animation: 'spin 1s linear infinite',
              color: '#51331b',
              margin: '0 auto 20px'
            }} />
            <p style={{ fontSize: '1.2rem', color: '#51331b', marginBottom: '10px' }}>
              Processing Receipt...
            </p>
            <p style={{ fontSize: '1rem', color: '#666' }}>
              {progress}%
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  backgroundColor: '#f0f0f0',
                  display: streamRef.current ? 'block' : 'none'
                }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {!streamRef.current ? (
                <>
                  <button
                    onClick={startCamera}
                    style={{
                      background: 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '18px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Camera size={24} />
                    Open Camera
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'linear-gradient(135deg, #dee6bf 0%, #c8d4a7 100%)',
                      color: '#51331b',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '18px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <UploadIcon size={24} />
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </>
              ) : (
                <button
                  onClick={capturePhoto}
                  style={{
                    background: 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '18px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Camera size={24} />
                  Capture Photo
                </button>
              )}
            </div>
          </>
        )}

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}