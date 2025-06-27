"use client";

import { useState, useRef } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2,
  Check
} from "lucide-react";

interface ListingMediaStepProps {
  data: Partial<MarketplaceListing>;
  updateData: (data: Partial<MarketplaceListing>) => void;
  errors: Record<string, string>;
}

// Demo image URLs for testing
const DEMO_IMAGES = [
  "/marketplace/item-1.jpg",
  "/marketplace/item-2.jpg",
  "/marketplace/item-3.jpg",
  "/marketplace/service-1.jpg",
  "/marketplace/service-2.jpg",
  "/marketplace/rental-1.jpg",
  "/marketplace/rental-2.jpg",
  "/marketplace/job-1.jpg",
];

export function ListingMediaStep({ data, updateData, errors }: ListingMediaStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedDemoImage, setSelectedDemoImage] = useState(data.imageUrl || "");
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, we would upload these files to a server
    // For demo purposes, we'll just create object URLs
    const newFiles = Array.from(files).map(file => URL.createObjectURL(file));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Update the listing data with the first image
    if (newFiles.length > 0 && !data.imageUrl) {
      updateData({ imageUrl: newFiles[0] });
    }
  };
  
  // Handle demo image selection
  const handleDemoImageSelect = (imageUrl: string) => {
    setSelectedDemoImage(imageUrl);
    updateData({ imageUrl });
  };
  
  // Handle image removal
  const handleRemoveImage = (imageUrl: string) => {
    setUploadedFiles(prev => prev.filter(url => url !== imageUrl));
    
    // If the removed image was the main image, update with another one or clear
    if (data.imageUrl === imageUrl) {
      const remainingImages = uploadedFiles.filter(url => url !== imageUrl);
      updateData({ 
        imageUrl: remainingImages.length > 0 ? remainingImages[0] : selectedDemoImage || "" 
      });
    }
  };
  
  // Handle click on file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Photos & Media</h2>
        <p className="text-muted-foreground mb-6">
          Add photos to showcase your {data.type || "listing"}
        </p>
      </div>
      
      <div className="space-y-6">
        {/* File upload area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer
            ${errors.imageUrl ? "border-red-500" : "border-muted-foreground/25"}`}
          onClick={handleUploadClick}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-full bg-primary/10">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Upload Images</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WEBP (Max 5MB each)
              </p>
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        {errors.imageUrl && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.imageUrl}</p>
        )}
        
        {/* Uploaded images */}
        {uploadedFiles.length > 0 && (
          <div>
            <h3 className="text-md font-medium mb-3">Uploaded Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className={`relative aspect-square rounded-md overflow-hidden border
                    ${data.imageUrl === file ? "ring-2 ring-primary" : ""}`}
                >
                  <img 
                    src={file} 
                    alt={`Uploaded ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoImageSelect(file);
                      }}
                    >
                      {data.imageUrl === file ? "Main Image" : "Set as Main"}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(file);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Demo images */}
        <div>
          <h3 className="text-md font-medium mb-3">Sample Images (For Demo)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a sample image to use for your listing
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {DEMO_IMAGES.map((image, index) => (
              <div 
                key={index} 
                className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer
                  ${selectedDemoImage === image ? "ring-2 ring-primary" : ""}`}
                onClick={() => handleDemoImageSelect(image)}
              >
                <img 
                  src={image} 
                  alt={`Demo ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                {selectedDemoImage === image && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
