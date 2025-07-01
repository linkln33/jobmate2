'use client';

import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  logoUrl?: string;
}

export function QRCodeGenerator({ url, size = 200, logoUrl }: QRCodeGeneratorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const downloadQRCode = () => {
    const canvas = document.getElementById('referral-qrcode') as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'jobmate-referral-qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Only render QR code on client side
  if (!mounted) return null;

  return (
    <Card className="p-4 flex flex-col items-center">
      <div className="mb-4">
        <QRCodeCanvas
          id="referral-qrcode"
          value={url}
          size={size}
          level="H"
          includeMargin={true}
          imageSettings={
            logoUrl
              ? {
                  src: logoUrl,
                  x: undefined,
                  y: undefined,
                  height: size * 0.2,
                  width: size * 0.2,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>
      <Button 
        onClick={downloadQRCode}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download size={16} />
        Download QR Code
      </Button>
    </Card>
  );
}
