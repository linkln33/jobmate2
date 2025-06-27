"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingGalleryProps {
  mainImage: string;
  images: string[];
  onImageSelect: (image: string) => void;
}

export function ListingGallery({ mainImage, images = [], onImageSelect }: ListingGalleryProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Ensure images is always an array with at least one item
  const safeImages = images && images.length > 0 ? images : [mainImage];

  const handlePrevious = () => {
    if (safeImages.length <= 1) return;
    
    const newIndex = currentIndex === 0 ? safeImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onImageSelect(safeImages[newIndex]);
  };

  const handleNext = () => {
    if (safeImages.length <= 1) return;
    
    const newIndex = currentIndex === safeImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onImageSelect(safeImages[newIndex]);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 aspect-[4/3]">
        <Image
          src={mainImage}
          alt="Listing image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        
        {/* Navigation Controls */}
        {safeImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        
        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Thumbnail Gallery */}
      {safeImages.length > 1 && (
        <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
          {safeImages.map((image, index) => (
            <div
              key={index}
              className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                mainImage === image ? "border-primary" : "border-transparent"
              }`}
              onClick={() => {
                onImageSelect(image);
                setCurrentIndex(index);
              }}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={toggleFullscreen}>
          <div className="relative w-full max-w-4xl h-full max-h-[80vh]">
            <Image
              src={mainImage}
              alt="Fullscreen image"
              fill
              className="object-contain"
              sizes="100vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              <span className="sr-only">Close</span>
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
