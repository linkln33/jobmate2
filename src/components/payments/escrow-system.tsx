"use client";

import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock, ArrowRight, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface EscrowSystemProps {
  jobId: string;
  jobTitle: string;
  totalAmount: number;
  escrowStatus: 'pending' | 'funded' | 'released' | 'disputed' | 'refunded';
  isCustomer: boolean;
  onFundEscrow?: () => void;
  onReleasePayment?: () => void;
  onInitiateDispute?: (reason: string) => void;
  onCancelDispute?: () => void;
  disputeDetails?: {
    reason: string;
    createdAt: string;
    status: 'open' | 'under_review' | 'resolved';
    resolution?: string;
  };
}

export function EscrowSystem({
  jobId,
  jobTitle,
  totalAmount,
  escrowStatus,
  isCustomer,
  onFundEscrow,
  onReleasePayment,
  onInitiateDispute,
  onCancelDispute,
  disputeDetails,
}: EscrowSystemProps) {
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle dispute submission
  const handleDisputeSubmit = async () => {
    if (!disputeReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (onInitiateDispute) {
        await onInitiateDispute(disputeReason);
      }
      setIsDisputeDialogOpen(false);
      setDisputeReason('');
    } catch (error) {
      console.error('Error submitting dispute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get escrow status badge
  const getStatusBadge = () => {
    switch (escrowStatus) {
      case 'pending':
        return <Badge variant="outline">Awaiting Funds</Badge>;
      case 'funded':
        return <Badge variant="secondary">Funds in Escrow</Badge>;
      case 'released':
        return <Badge variant="success">Payment Released</Badge>;
      case 'disputed':
        return <Badge variant="destructive">In Dispute</Badge>;
      case 'refunded':
        return <Badge variant="warning">Refunded</Badge>;
      default:
        return null;
    }
  };

  // Get progress value based on status
  const getProgressValue = () => {
    switch (escrowStatus) {
      case 'pending': return 0;
      case 'funded': return 50;
      case 'released': return 100;
      case 'disputed': return 50;
      case 'refunded': return 100;
      default: return 0;
    }
  };

  return (
    <Card className="border-brand-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-brand-600" />
              Protected Payment
            </CardTitle>
            <CardDescription>
              Funds are held securely until job completion
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Funds Deposited</span>
            <span>Job Completed</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Amount */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-lg font-semibold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Status Information */}
        <div className="space-y-2">
          {escrowStatus === 'pending' && (
            <div className="flex items-start space-x-3 text-sm">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Payment Required</p>
                <p className="text-muted-foreground">
                  {isCustomer 
                    ? "Your payment is required to start this job. Funds will be held securely in escrow."
                    : "Waiting for customer to fund the escrow before you can start the job."}
                </p>
              </div>
            </div>
          )}

          {escrowStatus === 'funded' && (
            <div className="flex items-start space-x-3 text-sm">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Funds in Escrow</p>
                <p className="text-muted-foreground">
                  {isCustomer 
                    ? "Your payment is being held securely. Release funds when the job is completed to your satisfaction."
                    : "Funds are secured in escrow. Complete the job to receive payment."}
                </p>
              </div>
            </div>
          )}

          {escrowStatus === 'released' && (
            <div className="flex items-start space-x-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Payment Complete</p>
                <p className="text-muted-foreground">
                  {isCustomer 
                    ? "You've released payment for this job. Thank you for using JobMate!"
                    : "Payment has been released to your account. It may take 1-2 business days to process."}
                </p>
              </div>
            </div>
          )}

          {escrowStatus === 'disputed' && disputeDetails && (
            <div className="flex items-start space-x-3 text-sm">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Dispute in Progress</p>
                <p className="text-muted-foreground">
                  Dispute opened on {disputeDetails.createdAt}. 
                  {disputeDetails.status === 'under_review' 
                    ? " Our team is reviewing this case."
                    : " Waiting for resolution."}
                </p>
                
                <div className="mt-3 p-3 bg-red-50 rounded-md">
                  <p className="font-medium text-red-800 mb-1">Dispute Reason:</p>
                  <p className="text-red-700">{disputeDetails.reason}</p>
                </div>
                
                {disputeDetails.resolution && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="font-medium text-blue-800 mb-1">Resolution:</p>
                    <p className="text-blue-700">{disputeDetails.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dispute Resolution */}
        {escrowStatus === 'disputed' && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h4 className="font-medium flex items-center mb-2">
              <Users className="h-4 w-4 mr-2" />
              Dispute Resolution
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Our community mediators are reviewing this dispute. You'll receive updates here and via email.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Status: <Badge variant="outline">{disputeDetails?.status.replace('_', ' ')}</Badge>
              </span>
              <Button variant="link" size="sm" className="p-0">
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-4 flex justify-end space-x-2">
        {escrowStatus === 'pending' && isCustomer && (
          <Button onClick={onFundEscrow}>Fund Escrow</Button>
        )}

        {escrowStatus === 'funded' && (
          <>
            {isCustomer && (
              <Button variant="success" onClick={onReleasePayment}>
                Release Payment
              </Button>
            )}
            <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dispute</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Open a Dispute</DialogTitle>
                  <DialogDescription>
                    Please explain the issue you're experiencing with this job. Be specific and include any relevant details.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea 
                    placeholder="Describe the issue..." 
                    className="min-h-[150px]"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDisputeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDisputeSubmit} 
                    disabled={!disputeReason.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {escrowStatus === 'disputed' && (
          <Button variant="outline" onClick={onCancelDispute}>
            Cancel Dispute
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
