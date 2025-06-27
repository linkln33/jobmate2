"use client";

import { useState, useEffect } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Clock, Tag } from "lucide-react";

interface ListingPricingStepProps {
  data: Partial<MarketplaceListing>;
  updateData: (data: Partial<MarketplaceListing>) => void;
  errors: Record<string, string>;
}

const PRICING_TYPES = [
  { id: "fixed", name: "Fixed Price", description: "Set a specific price for your listing" },
  { id: "auction", name: "Auction", description: "Let buyers bid on your listing" },
  { id: "hourly", name: "Hourly Rate", description: "Set an hourly rate for your service" },
  { id: "daily", name: "Daily Rate", description: "Set a daily rate for your rental" },
  { id: "negotiable", name: "Negotiable", description: "Allow buyers to make offers" },
];

export function ListingPricingStep({ data, updateData, errors }: ListingPricingStepProps) {
  const [hasDiscount, setHasDiscount] = useState(false);
  
  // Set appropriate pricing type based on listing type
  useEffect(() => {
    if (data.type && !data.pricingType) {
      let suggestedPricingType = "fixed";
      
      switch (data.type) {
        case "service":
          suggestedPricingType = "hourly";
          break;
        case "rental":
          suggestedPricingType = "daily";
          break;
        case "job":
          suggestedPricingType = "fixed";
          break;
        default:
          suggestedPricingType = "fixed";
      }
      
      updateData({ pricingType: suggestedPricingType as any });
    }
  }, [data.type, data.pricingType, updateData]);
  
  // Filter pricing types based on listing type
  const filteredPricingTypes = PRICING_TYPES.filter(type => {
    if (data.type === "job" && (type.id === "auction" || type.id === "daily")) {
      return false;
    }
    return true;
  });
  
  // Handle discount toggle
  useEffect(() => {
    if (hasDiscount && !data.originalPrice) {
      updateData({ originalPrice: (data.price || 0) * 1.2 });
    } else if (!hasDiscount && data.originalPrice) {
      updateData({ originalPrice: undefined });
    }
  }, [hasDiscount, data.price, data.originalPrice, updateData]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Pricing Information</h2>
        <p className="text-muted-foreground mb-6">
          Set the price and pricing model for your {data.type || "listing"}
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label>Pricing Type</Label>
          <RadioGroup 
            value={data.pricingType || "fixed"} 
            onValueChange={(value) => updateData({ 
              pricingType: value as any,
              // Reset price unit when pricing type changes
              priceUnit: value === "hourly" ? "hour" : value === "daily" ? "day" : "",
            })}
            className="grid grid-cols-1 gap-3 mt-2"
          >
            {filteredPricingTypes.map((type) => (
              <div 
                key={type.id}
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer
                  ${data.pricingType === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                  }`}
              >
                <RadioGroupItem value={type.id} id={`pricing-${type.id}`} />
                <Label 
                  htmlFor={`pricing-${type.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm text-muted-foreground">{type.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.pricingType && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pricingType}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="price">Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              className={`pl-9 ${errors.price ? "border-red-500" : ""}`}
              value={data.price || ""}
              onChange={(e) => {
                const price = parseFloat(e.target.value);
                updateData({ 
                  price: isNaN(price) ? 0 : price,
                  // Update original price if discount is enabled
                  originalPrice: hasDiscount ? (isNaN(price) ? 0 : price * 1.2) : undefined
                });
              }}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
          )}
          
          {/* Price unit for hourly/daily */}
          {(data.pricingType === "hourly" || data.pricingType === "daily") && (
            <div className="mt-3">
              <Label htmlFor="priceUnit">Price Unit</Label>
              <Select 
                value={data.priceUnit || ""} 
                onValueChange={(value) => updateData({ priceUnit: value })}
              >
                <SelectTrigger id="priceUnit" className={errors.priceUnit ? "border-red-500" : ""}>
                  <SelectValue placeholder={`Select unit (${data.pricingType === "hourly" ? "hour" : "day"})`} />
                </SelectTrigger>
                <SelectContent>
                  {data.pricingType === "hourly" ? (
                    <>
                      <SelectItem value="hour">Per Hour</SelectItem>
                      <SelectItem value="project">Per Project</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.priceUnit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priceUnit}</p>
              )}
            </div>
          )}
          
          {/* Auction settings */}
          {data.pricingType === "auction" && (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="minimumBid">Minimum Bid</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minimumBid"
                    type="number"
                    placeholder="0.00"
                    className="pl-9"
                    value={data.minimumBid || data.price || ""}
                    onChange={(e) => {
                      const minimumBid = parseFloat(e.target.value);
                      updateData({ minimumBid: isNaN(minimumBid) ? 0 : minimumBid });
                    }}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="auctionEndTime">Auction Duration</Label>
                <Select 
                  value={data.auctionEndTime || "7d"} 
                  onValueChange={(value) => updateData({ auctionEndTime: value })}
                >
                  <SelectTrigger id="auctionEndTime">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="3d">3 Days</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="14d">14 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        {/* Discount option for fixed price */}
        {data.pricingType === "fixed" && (
          <div className="flex items-center space-x-2">
            <Switch
              id="discount"
              checked={hasDiscount}
              onCheckedChange={setHasDiscount}
            />
            <Label htmlFor="discount" className="cursor-pointer">
              Add sale price / discount
            </Label>
            
            {hasDiscount && (
              <div className="ml-4 flex items-center gap-2">
                <Label htmlFor="originalPrice" className="sr-only">Original Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="Original price"
                    className="pl-9 w-32"
                    value={data.originalPrice || ""}
                    onChange={(e) => {
                      const originalPrice = parseFloat(e.target.value);
                      updateData({ originalPrice: isNaN(originalPrice) ? 0 : originalPrice });
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">Original price</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
