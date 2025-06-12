import React, { useState, useEffect } from 'react';

interface WhatsAppChatProps {
  phoneNumber: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
  autoOpen?: boolean;
  autoOpenTimeout?: number;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  phoneNumber,
  welcomeMessage = "Hello! How can we help you today?",
  position = 'bottom-right',
  autoOpen = false,
  autoOpenTimeout = 5000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [businessInfo] = useState({
    name: 'Plumer Services',
    status: 'Typically replies within an hour',
    avatar: '/images/logo.png',
  });

  // Format phone number (remove any non-digit characters)
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  
  // WhatsApp chat URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(welcomeMessage)}`;

  // Auto open chat after timeout
  useEffect(() => {
    if (autoOpen && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, autoOpenTimeout);
      
      return () => clearTimeout(timer);
    }
  }, [autoOpen, autoOpenTimeout, hasAutoOpened]);

  // Position classes
  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300 animate-bounce"
          aria-label="Open WhatsApp Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-green-500 p-4 flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-white">
              <img 
                src={businessInfo.avatar} 
                alt={businessInfo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{businessInfo.name}</h3>
              <p className="text-green-100 text-xs">{businessInfo.status}</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-200"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-gray-100 p-4 flex-1 h-64">
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs ml-auto">
              <p className="text-gray-700 text-sm">{welcomeMessage}</p>
              <span className="text-xs text-gray-500 block text-right mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Chat Footer */}
          <div className="bg-white p-4 border-t">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white w-full py-2 px-3 rounded-md flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 mr-2 fill-current">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              Continue on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;
