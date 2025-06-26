"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MarketplaceItem } from '@/types/profile-extended';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NewMarketplaceItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<MarketplaceItem>) => void;
}

// Form schema
const marketplaceItemSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  locationAddress: z.string().min(3, "Please enter a location"),
  shippingAvailable: z.boolean().default(false),
  tags: z.array(z.string()),
});

type MarketplaceItemFormValues = z.infer<typeof marketplaceItemSchema>;

export function NewMarketplaceItemModal({ isOpen, onClose, onSubmit }: NewMarketplaceItemModalProps) {
  const [tagInput, setTagInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  
  // Initialize form
  const form = useForm<MarketplaceItemFormValues>({
    resolver: zodResolver(marketplaceItemSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      subcategory: '',
      price: '',
      condition: 'good',
      locationAddress: '',
      shippingAvailable: false,
      tags: [],
    },
  });
  
  // Categories for the dropdown
  const itemCategories = [
    "Electronics",
    "Furniture",
    "Clothing & Accessories",
    "Home & Garden",
    "Sports & Outdoors",
    "Toys & Games",
    "Books & Media",
    "Automotive",
    "Collectibles",
    "Tools & Equipment",
    "Musical Instruments",
    "Health & Beauty",
    "Other"
  ];
  
  // Handle tag input
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.getValues().tags.includes(tag)) {
      form.setValue('tags', [...form.getValues().tags, tag]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    form.setValue('tags', form.getValues().tags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle media upload
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newMediaFiles = [...mediaFiles, ...newFiles].slice(0, 5); // Limit to 5 files
      setMediaFiles(newMediaFiles);
      
      // Create preview URLs
      const newPreviewUrls = newMediaFiles.map(file => URL.createObjectURL(file));
      setMediaPreviewUrls(newPreviewUrls);
    }
  };
  
  const handleRemoveMedia = (index: number) => {
    const newMediaFiles = [...mediaFiles];
    newMediaFiles.splice(index, 1);
    setMediaFiles(newMediaFiles);
    
    const newPreviewUrls = [...mediaPreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up URL
    newPreviewUrls.splice(index, 1);
    setMediaPreviewUrls(newPreviewUrls);
  };
  
  // Handle form submission
  const handleFormSubmit = (values: MarketplaceItemFormValues) => {
    // Transform form values to MarketplaceItem format
    const itemData: Partial<MarketplaceItem> = {
      title: values.title,
      description: values.description,
      category: values.category,
      subcategory: values.subcategory || undefined,
      price: Number(values.price),
      condition: values.condition,
      location: {
        address: values.locationAddress,
        coordinates: {
          lat: 0, // Would be set by geocoding in a real implementation
          lng: 0
        },
        shippingAvailable: values.shippingAvailable
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: values.tags,
      views: 0,
      favorites: 0,
      // Media would be uploaded and URLs returned from backend in a real implementation
      media: mediaPreviewUrls.map((url, index) => ({
        id: `temp-${index}`,
        type: 'image',
        url: url,
        thumbnail: url
      }))
    };
    
    onSubmit(itemData);
    
    // Clean up preview URLs
    mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setMediaFiles([]);
    setMediaPreviewUrls([]);
    form.reset();
  };
  
  // Clean up preview URLs when modal closes
  const handleClose = () => {
    mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setMediaFiles([]);
    setMediaPreviewUrls([]);
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List New Item</DialogTitle>
          <DialogDescription>
            Create a new marketplace listing to sell your item.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            {/* Item Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Professional DSLR Camera Kit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Item Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the item in detail including features, condition, and any other relevant information..." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {itemCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cameras, Desks, Laptops" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Price & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                        <Input className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Location */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="locationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Boston, MA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shippingAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Shipping Available</FormLabel>
                      <FormDescription>
                        Are you willing to ship this item to buyers?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Media Upload */}
            <div className="space-y-2">
              <FormLabel>Item Photos (up to 5)</FormLabel>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="media-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleMediaChange}
                  disabled={mediaFiles.length >= 5}
                />
                
                {mediaPreviewUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                    {mediaPreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-24 w-full rounded-md overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {mediaFiles.length < 5 && (
                      <label
                        htmlFor="media-upload"
                        className="flex flex-col items-center justify-center h-24 w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Add More</span>
                      </label>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="media-upload"
                    className="flex flex-col items-center justify-center h-32 cursor-pointer"
                  >
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag photos here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Recommended: at least one clear photo of your item)
                    </p>
                  </label>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex">
                        <Input
                          placeholder="Add tags (e.g. camera, vintage, electronics)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={handleAddTag}
                          className="ml-2"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.getValues().tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-2 py-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">List Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
