import React from 'react';
import { CameraView } from '@/components/camera/CameraView';
import { Navigation } from '@/components/navigation';

export default function CameraPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6">
        <CameraView />
      </main>
    </div>
  );
}
