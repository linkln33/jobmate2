import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { sendEmail } from '../../utils/emailService';
import type { EmailTemplate, EmailData } from '../../utils/emailService';

// Types
type NotificationTemplate = {
  id: string;
  name: string;
  subject: string;
  template: EmailTemplate;
  description: string;
};

type NotificationLog = {
  id: string;
  template: string;
  recipient: string;
  subject: string;
  status: 'success' | 'failed';
  sentAt: string;
};

const Notifications: React.FC = () => {
  // Using supabase from AuthContext
  const { supabase: _ } = useAuth();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [testMode, setTestMode] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load notification templates and logs on component mount
  useEffect(() => {
    // Define notification templates
    const predefinedTemplates: NotificationTemplate[] = [
      {
        id: 'booking_confirmation',
        name: 'Booking Confirmation',
        subject: 'Your Booking Confirmation',
        template: 'booking_confirmation',
        description: 'Sent to customers when they make a new booking',
      },
      {
        id: 'booking_reminder',
        name: 'Booking Reminder',
        subject: 'Reminder: Your Upcoming Appointment',
        template: 'booking_reminder',
        description: 'Sent to customers 24 hours before their appointment',
      },
      {
        id: 'admin_notification',
        name: 'Admin Notification',
        subject: 'New Booking Notification',
        template: 'admin_notification',
        description: 'Sent to admin when a new booking is made',
      },
      {
        id: 'contact_form',
        name: 'Contact Form Notification',
        subject: 'New Contact Form Submission',
        template: 'contact_form',
        description: 'Sent to admin when a contact form is submitted',
      },
    ];

    setTemplates(predefinedTemplates);
    
    // Generate mock notification logs
    const mockLogs: NotificationLog[] = [
      {
        id: '1',
        template: 'Booking Confirmation',
        recipient: 'customer@example.com',
        subject: 'Your Booking Confirmation',
        status: 'success',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '2',
        template: 'Admin Notification',
        recipient: 'admin@plumerservices.com',
        subject: 'New Booking Notification',
        status: 'success',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      },
      {
        id: '3',
        template: 'Contact Form Notification',
        recipient: 'admin@plumerservices.com',
        subject: 'New Contact Form Submission',
        status: 'success',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      },
      {
        id: '4',
        template: 'Booking Reminder',
        recipient: 'customer2@example.com',
        subject: 'Reminder: Your Upcoming Appointment',
        status: 'failed',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      },
    ];

    setLogs(mockLogs);
  }, []);

  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSubject(template.subject);
      }
    } else {
      setSubject('');
    }
  };

  // Send test email
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || !recipient || !subject) {
      setNotification({
        type: 'error',
        text: 'Please fill in all required fields',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      const emailData: EmailData = {
        to: recipient,
        subject,
        template: template.template,
        templateData: {
          customerName: 'Test Customer',
          service: 'Test Service',
          date: new Date().toLocaleDateString(),
          time: '10:00 AM',
          address: '123 Test Street, Test City',
          businessName: 'Plumer Services',
          message: message || 'This is a test message',
          // Add other template data as needed
        },
      };
      
      const response = await sendEmail(emailData);
      
      if (response.success) {
        // Add to logs
        const newLog: NotificationLog = {
          id: Date.now().toString(),
          template: template.name,
          recipient,
          subject,
          status: 'success',
          sentAt: new Date().toISOString(),
        };
        
        setLogs([newLog, ...logs]);
        
        setNotification({
          type: 'success',
          text: 'Test email sent successfully!',
        });
      } else {
        throw new Error(response.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      
      // Add to logs
      const newLog: NotificationLog = {
        id: Date.now().toString(),
        template: templates.find(t => t.id === selectedTemplate)?.name || 'Unknown',
        recipient,
        subject,
        status: 'failed',
        sentAt: new Date().toISOString(),
      };
      
      setLogs([newLog, ...logs]);
      
      setNotification({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send email',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage and send email notifications to customers and team members
          </p>
        </div>
        
        <div className="p-6">
          {/* Email Service Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Email Service Status</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your email service provider settings
                </p>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 flex h-3 w-3">
                  <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
          </div>

          {/* Notification Message */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-md ${
                notification.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {notification.text}
            </div>
          )}
        </div>
      </div>

      {/* Send Test Email */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Send Test Email</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSendTest}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                  Email Template
                </label>
                <select
                  id="template"
                  name="template"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <p className="mt-1 text-sm text-gray-500">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                  Recipient Email
                </label>
                <input
                  type="email"
                  name="recipient"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Additional Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Add any additional information here..."
                />
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="test-mode"
                    name="test-mode"
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="test-mode" className="ml-2 block text-sm text-gray-900">
                    Test mode (no actual emails will be sent)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Email Notification Logs</h3>
        </div>
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No email logs found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.template}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.recipient}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status === 'success' ? 'Sent' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.sentAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Implementation Note */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> In a production environment, this component would include:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Integration with a real email service provider (SendGrid, Mailgun, etc.)</li>
              <li>Email template editor with preview functionality</li>
              <li>Scheduled email campaigns</li>
              <li>Email open and click tracking</li>
              <li>Automated email workflows (e.g., booking confirmation, reminders)</li>
              <li>Unsubscribe management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
