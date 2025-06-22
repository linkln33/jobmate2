"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Mail,
  User,
  Image,
  FileText
} from 'lucide-react';

interface BasicVerificationProps {
  verificationStatus: {
    email: boolean;
    phone: boolean;
    termsAccepted: boolean;
    profileComplete: boolean;
    progress: number;
  };
  setVerificationStatus: (status: any) => void;
}

export function BasicVerification({ verificationStatus, setVerificationStatus }: BasicVerificationProps) {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [termsChecked, setTermsChecked] = useState(verificationStatus.termsAccepted);

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    // Allow skipping phone verification
    const skipVerification = window.confirm("Would you like to skip phone verification? (It's optional)");
    if (skipVerification) {
      toast({
        title: "Verification Skipped",
        description: "Phone verification has been marked as optional"
      });
      return;
    }
    
    // Simulate OTP sending
    toast({
      title: "OTP Sent",
      description: "A verification code has been sent to your phone"
    });
    setOtpSent(true);
  };

  const handleVerifyOTP = () => {
    if (!otpCode || otpCode.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid verification code",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate OTP verification
    toast({
      title: "Phone Verified",
      description: "Your phone number has been verified successfully"
    });
    
    setVerificationStatus({
      ...verificationStatus,
      phone: true
    });
  };

  const handleProfileUpdate = () => {
    if (!displayName) {
      toast({
        title: "Display Name Required",
        description: "Please enter a display name for your profile",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate profile update
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated"
    });
    
    setVerificationStatus({
      ...verificationStatus,
      profileComplete: true
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsChecked(checked);
    setVerificationStatus({
      ...verificationStatus,
      termsAccepted: checked
    });
  };

  return (
    <div className="space-y-8">
      {/* Email Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Email Verification</h3>
          </div>
          {verificationStatus.email ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500">
              <Clock className="h-5 w-5 mr-1" />
              <span>Pending</span>
            </div>
          )}
        </div>
        
        {verificationStatus.email ? (
          <p className="text-sm text-muted-foreground">Your email has been verified.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify.
            </p>
            <Button variant="outline" size="sm">Resend Verification Email</Button>
          </div>
        )}
      </div>
      
      {/* Phone Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Phone Verification</h3>
          </div>
          {verificationStatus.phone ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-1" />
              <span>Optional</span>
            </div>
          )}
        </div>
        
        {verificationStatus.phone ? (
          <p className="text-sm text-muted-foreground">Your phone number has been verified.</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="flex space-x-2">
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 123-4567" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button onClick={handleSendOTP} disabled={otpSent}>
                  {otpSent ? 'Sent' : 'Send OTP'}
                </Button>
              </div>
            </div>
            
            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="otp" 
                    placeholder="Enter OTP" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                  <Button onClick={handleVerifyOTP}>Verify</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Terms of Service */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Terms of Service</h3>
          </div>
          {verificationStatus.termsAccepted ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Accepted</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500">
              <Clock className="h-5 w-5 mr-1" />
              <span>Required</span>
            </div>
          )}
        </div>
        
        <div className="flex items-top space-x-2">
          <Checkbox 
            id="terms" 
            checked={termsChecked}
            onCheckedChange={handleTermsChange}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the Terms of Service and Privacy Policy
            </label>
            <p className="text-sm text-muted-foreground">
              By checking this box, you agree to our{" "}
              <a href="#" className="text-primary underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      
      {/* Profile Information (Optional) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Profile Information (Optional)</h3>
          </div>
          {verificationStatus.profileComplete ? (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              <span>Complete</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-1" />
              <span>Optional</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input 
              id="displayName" 
              placeholder="How you want to be known on the platform" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Picture</Label>
            <div className="flex items-center space-x-4">
              {profileImageUrl && (
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img 
                    src={profileImageUrl} 
                    alt="Profile preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <Label 
                  htmlFor="profileImage" 
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Image className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                  </div>
                  <input 
                    id="profileImage" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
            </div>
          </div>
          
          <Button onClick={handleProfileUpdate} disabled={!displayName}>
            Save Profile Information
          </Button>
        </div>
      </div>
    </div>
  );
}
