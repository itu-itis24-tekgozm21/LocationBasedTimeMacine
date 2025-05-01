import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, X, RefreshCw } from "lucide-react";

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  
  const startCamera = async () => {
    setError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please make sure you've granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setIsActive(false);
    }
  };

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const switchCamera = async () => {
    stopCamera();
    try {
      // Toggle between front and back cameras
      const currentFacingMode = stream?.getVideoTracks()[0].getSettings().facingMode;
      const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: newFacingMode } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      console.error("Error switching camera:", err);
      setError("Could not switch camera. Your device might not support multiple cameras.");
      // Try to restart the previous camera
      startCamera();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Camera View</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Point your camera at historical sites to experience AR features.
      </p>

      <Card className="w-full overflow-hidden mb-4">
        <CardContent className="p-0 relative">
          {error && (
            <Alert variant="destructive" className="m-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
                <Camera size={48} className="mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            <Button 
              variant={isActive ? "destructive" : "default"}
              size="icon"
              onClick={toggleCamera}
              className="rounded-full h-12 w-12"
            >
              {isActive ? <X size={24} /> : <Camera size={24} />}
            </Button>
            
            {isActive && (
              <Button 
                variant="secondary"
                size="icon"
                onClick={switchCamera}
                className="rounded-full h-12 w-12"
              >
                <RefreshCw size={24} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mt-2 text-center">
        <p>Note: This feature works best on mobile devices with back cameras.</p>
        <p>Future versions will include AR overlays of historical reconstructions.</p>
      </div>
    </div>
  );
}
