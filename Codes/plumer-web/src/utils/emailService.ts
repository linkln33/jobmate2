// Email Service Utility

// Types
export type EmailTemplate = 'booking_confirmation' | 'booking_reminder' | 'admin_notification' | 'contact_form' | 'custom';

export interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  templateData: Record<string, any>;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using the configured email service
 * In production, this would connect to a real email service like SendGrid, Mailgun, etc.
 */
export const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
  try {
    // In a real implementation, this would call an actual email service API
    console.log('Sending email:', emailData);
    
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_EMAIL_SERVICE_API_KEY;
    
    if (!apiKey) {
      console.warn('Email service API key not configured');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response
    return {
      success: true,
      messageId: `mock-email-${Date.now()}`,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get HTML content for an email template
 */
export const getEmailTemplate = (template: EmailTemplate, data: Record<string, any>): string => {
  switch (template) {
    case 'booking_confirmation':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Booking Confirmation</h2>
          <p>Dear ${data.customerName},</p>
          <p>Thank you for booking our plumbing service. Your appointment has been confirmed.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Address:</strong> ${data.address}</p>
          </div>
          <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
          <p>Thank you for choosing our services!</p>
          <p>Best regards,<br>${data.businessName}</p>
        </div>
      `;
      
    case 'booking_reminder':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Appointment Reminder</h2>
          <p>Dear ${data.customerName},</p>
          <p>This is a friendly reminder about your upcoming plumbing service appointment.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Address:</strong> ${data.address}</p>
          </div>
          <p>If you need to reschedule or have any questions, please contact us as soon as possible.</p>
          <p>We look forward to serving you!</p>
          <p>Best regards,<br>${data.businessName}</p>
        </div>
      `;
      
    case 'admin_notification':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">New Booking Notification</h2>
          <p>A new booking has been made on your website.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Phone:</strong> ${data.customerPhone}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Message:</strong> ${data.message || 'No additional message'}</p>
          </div>
          <p>Please log in to your admin dashboard to manage this booking.</p>
        </div>
      `;
      
    case 'contact_form':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">New Contact Form Submission</h2>
          <p>You have received a new message from your website contact form.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          </div>
        </div>
      `;
      
    case 'custom':
      return data.htmlContent || '';
      
    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">${data.subject || 'Notification'}</h2>
          <p>${data.message || 'No message content'}</p>
        </div>
      `;
  }
};

/**
 * Send a booking confirmation email to the customer
 */
export const sendBookingConfirmation = async (bookingData: any): Promise<EmailResponse> => {
  return sendEmail({
    to: bookingData.email,
    subject: 'Booking Confirmation',
    template: 'booking_confirmation',
    templateData: {
      customerName: bookingData.name,
      service: bookingData.service,
      date: new Date(bookingData.date).toLocaleDateString(),
      time: bookingData.time,
      address: bookingData.address,
      businessName: 'Plumer Services',
    },
  });
};

/**
 * Send a booking notification to the admin
 */
export const sendAdminNotification = async (bookingData: any): Promise<EmailResponse> => {
  // In production, you would get the admin email from your configuration
  const adminEmail = 'admin@plumerservices.com';
  
  return sendEmail({
    to: adminEmail,
    subject: 'New Booking Notification',
    template: 'admin_notification',
    templateData: {
      customerName: bookingData.name,
      customerEmail: bookingData.email,
      customerPhone: bookingData.phone,
      service: bookingData.service,
      date: new Date(bookingData.date).toLocaleDateString(),
      time: bookingData.time,
      address: bookingData.address,
      message: bookingData.message,
    },
  });
};

/**
 * Send a contact form submission notification to the admin
 */
export const sendContactFormNotification = async (formData: any): Promise<EmailResponse> => {
  // In production, you would get the admin email from your configuration
  const adminEmail = 'admin@plumerservices.com';
  
  return sendEmail({
    to: adminEmail,
    subject: 'New Contact Form Submission',
    template: 'contact_form',
    templateData: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    },
  });
};
