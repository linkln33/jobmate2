"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  Camera, 
  FileText, 
  MapPin,
  CreditCard,
  Video,
  AlertCircle,
  Shield
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AdvancedVerificationProps {
  verificationStatus: {
    idVerified: boolean;
    selfieMatch: boolean;
    licensesUploaded: boolean;
    videoIntro: boolean;
    serviceArea: boolean;
    paymentSetup: boolean;
    progress: number;
  };
  setVerificationStatus: (status: any) => void;
}

export function AdvancedVerification({ verificationStatus, setVerificationStatus }: AdvancedVerificationProps) {
  const { toast } = useToast();
  const [idUploadFile, setIdUploadFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [licenseFiles, setLicenseFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [serviceAreaSet, setServiceAreaSet] = useState(false);
  const [showIdVerificationModal, setShowIdVerificationModal] = useState(false);

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdUploadFile(e.target.files[0]);
      toast({
        title: "ID Uploaded",
        description: "Your ID has been uploaded and is pending verification"
      });
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
      toast({
        title: "Selfie Uploaded",
        description: "Your selfie has been uploaded for verification"
      });
      
      // Simulate verification process
      setTimeout(() => {
        setVerificationStatus({
          ...verificationStatus,
          selfieMatch: true
        });
        
        toast({
          title: "Selfie Verified",
          description: "Your selfie has been matched with your ID"
        });
      }, 2000);
    }
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setLicenseFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "License Uploaded",
        description: `${newFiles.length} file(s) uploaded successfully`
      });
      
      setVerificationStatus({
        ...verificationStatus,
        licensesUploaded: true
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      
      toast({
        title: "Video Uploaded",
        description: "Your introduction video has been uploaded"
      });
      
      setVerificationStatus({
        ...verificationStatus,
        videoIntro: true
      });
    }
  };

  const handleSetupServiceArea = () => {
    // In a real app, this would open a map interface
    setServiceAreaSet(true);
    
    toast({
      title: "Service Area Set",
      description: "Your service area has been configured"
    });
    
    setVerificationStatus({
      ...verificationStatus,
      serviceArea: true
    });
  };

  const handleSetupPayment = () => {
    // In a real app, this would redirect to Stripe Connect onboarding
    toast({
      title: "Payment Setup",
      description: "Your payment account has been connected"
    });
    
    setVerificationStatus({
      ...verificationStatus,
      paymentSetup: true
    });
  };

  const startIdVerification = () => {
    setShowIdVerificationModal(true);
    
    // Simulate ID verification with Onfido/Persona
    setTimeout(() => {
      setVerificationStatus({
        ...verificationStatus,
        idVerified: true
      });
      
      setShowIdVerificationModal(false);
      
      toast({
        title: "ID Verified",
        description: "Your government ID has been verified successfully"
      });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Government ID Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Government ID Verification</h3>
          </div>
          {verificationStatus.idVerified ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500">
              <AlertCircle className="h-5 w-5 mr-1" />
              <span>Required</span>
            </div>
          )}
        </div>
        
        {verificationStatus.idVerified ? (
          <p className="text-sm text-muted-foreground">Your government ID has been verified.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We need to verify your identity with a government-issued ID (driver's license, passport, or national ID card).
            </p>
            
            <Button onClick={startIdVerification}>
              Start ID Verification
            </Button>
            
            {showIdVerificationModal && (
              <Card className="p-4 border-2 border-dashed">
                <div className="flex flex-col items-center justify-center space-y-4 p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-slate-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center">Verifying your ID... Please wait</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      
      {/* Selfie Match */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Selfie Verification</h3>
          </div>
          {verificationStatus.selfieMatch ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500">
              <AlertCircle className="h-5 w-5 mr-1" />
              <span>Required</span>
            </div>
          )}
        </div>
        
        {verificationStatus.selfieMatch ? (
          <p className="text-sm text-muted-foreground">Your selfie has been verified and matched with your ID.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Take a selfie to verify that you match your ID photo. This helps prevent fraud and build trust.
            </p>
            
            <div className="flex items-center space-x-4">
              <Label 
                htmlFor="selfieUpload" 
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-gray-400 transition-colors"
              >
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Take or upload selfie</span>
                <input 
                  id="selfieUpload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                />
              </Label>
              
              {selfieFile && (
                <div>
                  <p className="text-sm font-medium">Uploaded: {selfieFile.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Licenses/Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Licenses & Certifications</h3>
          </div>
          {verificationStatus.licensesUploaded ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Uploaded</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-1" />
              <span>If Applicable</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload any professional licenses or certifications relevant to your services. This helps build trust with potential clients.
          </p>
          
          <div className="flex items-center space-x-4">
            <Label 
              htmlFor="licenseUpload" 
              className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-gray-400 transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload licenses/certifications</span>
              <input 
                id="licenseUpload" 
                type="file" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleLicenseUpload}
              />
            </Label>
            
            {licenseFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium">{licenseFiles.length} file(s) uploaded</p>
                <ul className="text-xs text-muted-foreground">
                  {licenseFiles.slice(0, 2).map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                  {licenseFiles.length > 2 && <li>+ {licenseFiles.length - 2} more</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Video Introduction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Video Introduction</h3>
          </div>
          {verificationStatus.videoIntro ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Uploaded</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-1" />
              <span>Optional</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Record a short video introduction (30-60 seconds) to showcase your personality and build trust with potential clients.
          </p>
          
          <div className="flex items-center space-x-4">
            <Label 
              htmlFor="videoUpload" 
              className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-gray-400 transition-colors"
            >
              <Video className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload video introduction</span>
              <input 
                id="videoUpload" 
                type="file" 
                className="hidden" 
                accept="video/*"
                onChange={handleVideoUpload}
              />
            </Label>
            
            {videoFile && (
              <div>
                <p className="text-sm font-medium">Uploaded: {videoFile.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Service Area Setup */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Service Area Setup</h3>
          </div>
          {verificationStatus.serviceArea ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Configured</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500">
              <AlertCircle className="h-5 w-5 mr-1" />
              <span>Required</span>
            </div>
          )}
        </div>
        
        {verificationStatus.serviceArea ? (
          <p className="text-sm text-muted-foreground">Your service area has been configured.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Define the geographic area where you're available to provide services. This helps match you with nearby jobs.
            </p>
            
            <Button onClick={handleSetupServiceArea}>
              Set Up Service Area
            </Button>
          </div>
        )}
      </div>
      
      {/* Payment Setup */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Payment Setup</h3>
          </div>
          {verificationStatus.paymentSetup ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500">
              <AlertCircle className="h-5 w-5 mr-1" />
              <span>Required</span>
            </div>
          )}
        </div>
        
        {verificationStatus.paymentSetup ? (
          <p className="text-sm text-muted-foreground">Your payment account has been connected.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your bank account or payment method to receive payments for your services through our platform.
            </p>
            
            <Button onClick={handleSetupPayment}>
              Set Up Payment Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
