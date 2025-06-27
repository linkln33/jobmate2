"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Flag, Phone } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

interface ListingActionsProps {
  listingId: string;
  contactPhone?: string;
}

export function ListingActions({ listingId, contactPhone }: ListingActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would call an API to save the favorite status
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this listing on JobMate',
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copying to clipboard
        copyToClipboard(url);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(url);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  const handleReport = () => {
    // In a real app, this would open a report form or dialog
    alert('Report functionality would open here');
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-3">
        <Button
          variant={isFavorite ? "default" : "outline"}
          className={`w-full flex items-center justify-center gap-2 ${
            isFavorite ? "bg-rose-500 hover:bg-rose-600" : ""
          }`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
          {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share Listing
        </Button>
        
        {contactPhone && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Show Phone Number
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contact Information</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-xl font-bold mb-2">{contactPhone}</p>
                <p className="text-sm text-muted-foreground">
                  Let the seller know you found them on JobMate
                </p>
              </div>
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-muted-foreground"
          onClick={handleReport}
        >
          <Flag className="h-4 w-4" />
          Report Listing
        </Button>
      </div>
    </Card>
  );
}
