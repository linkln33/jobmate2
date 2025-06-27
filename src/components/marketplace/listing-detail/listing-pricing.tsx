"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, AlertCircle } from "lucide-react";

interface ListingPricingProps {
  price: number;
  pricingType: "fixed" | "auction" | "hourly" | "daily" | "negotiable";
  originalPrice?: number;
  auctionEndTime?: string;
  minimumBid?: number;
  currentHighestBid?: number;
  bidCount?: number;
}

export function ListingPricing({
  price,
  pricingType,
  originalPrice,
  auctionEndTime,
  minimumBid,
  currentHighestBid,
  bidCount = 0,
}: ListingPricingProps) {
  const [bidAmount, setBidAmount] = useState(minimumBid || currentHighestBid ? (currentHighestBid || 0) + 5 : price);
  const [showBidForm, setShowBidForm] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the bid to an API
    alert(`Bid of ${formatPrice(bidAmount)} submitted!`);
    setShowBidForm(false);
  };

  const renderPricingContent = () => {
    switch (pricingType) {
      case "fixed":
        return (
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {originalPrice && originalPrice > price && (
                <span className="ml-2 text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="mt-1 text-sm text-green-600 font-medium">
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
        );

      case "auction":
        return (
          <div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Current bid</div>
                <div className="text-3xl font-bold">{formatPrice(currentHighestBid || price)}</div>
                <div className="text-sm text-muted-foreground mt-1">{bidCount} bids</div>
              </div>

              {auctionEndTime && (
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Ends in {auctionEndTime}</span>
                </div>
              )}

              {showBidForm ? (
                <form onSubmit={handleBidSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium mb-1">
                      Your bid (minimum {formatPrice(minimumBid || (currentHighestBid || price) + 5)})
                    </label>
                    <Input
                      id="bidAmount"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={minimumBid || (currentHighestBid || price) + 5}
                      step="5"
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Place Bid
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  onClick={() => setShowBidForm(true)}
                  className="w-full"
                >
                  Place Bid
                </Button>
              )}
            </div>
          </div>
        );

      case "hourly":
        return (
          <div>
            <div className="text-3xl font-bold">{formatPrice(price)}<span className="text-lg font-normal">/hour</span></div>
            <div className="mt-2 text-sm text-muted-foreground">
              Estimated project time: 10-20 hours
            </div>
          </div>
        );

      case "daily":
        return (
          <div>
            <div className="text-3xl font-bold">{formatPrice(price)}<span className="text-lg font-normal">/day</span></div>
            <div className="mt-2 text-sm text-muted-foreground">
              Minimum rental: 1 day
            </div>
          </div>
        );

      case "negotiable":
        return (
          <div>
            <div className="text-3xl font-bold">{formatPrice(price)}</div>
            <div className="mt-1 text-sm text-muted-foreground italic">
              Price negotiable
            </div>
            <Button className="w-full mt-4">
              Make an Offer
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-3xl font-bold">{formatPrice(price)}</div>
        );
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pricing</h2>
      
      <div className="space-y-6">
        {renderPricingContent()}
        
        {pricingType === "fixed" && (
          <Button className="w-full">
            Buy Now
          </Button>
        )}
        
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>
            {pricingType === "auction" 
              ? "All bids are binding. By placing a bid, you agree to purchase this item if you win."
              : "Payment is secured through JobMate's secure payment system."}
          </span>
        </div>
      </div>
    </Card>
  );
}
