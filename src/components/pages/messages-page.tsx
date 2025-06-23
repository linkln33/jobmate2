"use client";

import { useState } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(0);
  const [messageInput, setMessageInput] = useState('');
  
  // Mock data for conversations
  const conversations = [
    {
      id: 0,
      name: 'John Doe',
      avatar: '',
      lastMessage: 'I need help with my project',
      time: '10:30 AM',
      unread: 2,
      messages: [
        { id: 1, sender: 'them', content: 'Hi there! I need help with my project', time: '10:25 AM' },
        { id: 2, sender: 'them', content: 'Are you available for a quick consultation?', time: '10:26 AM' },
        { id: 3, sender: 'me', content: 'Hello! Yes, I am available. What kind of project are you working on?', time: '10:28 AM' },
        { id: 4, sender: 'them', content: 'It\'s a website redesign for my small business', time: '10:30 AM' },
      ]
    },
    {
      id: 1,
      name: 'Jane Smith',
      avatar: '',
      lastMessage: 'Thanks for your help!',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { id: 1, sender: 'me', content: 'How\'s the project coming along?', time: 'Yesterday, 2:15 PM' },
        { id: 2, sender: 'them', content: 'It\'s going well! I\'ve completed the first milestone', time: 'Yesterday, 2:20 PM' },
        { id: 3, sender: 'me', content: 'That\'s great to hear! Let me know if you need any assistance', time: 'Yesterday, 2:25 PM' },
        { id: 4, sender: 'them', content: 'Thanks for your help!', time: 'Yesterday, 2:30 PM' },
      ]
    },
    {
      id: 2,
      name: 'Alex Johnson',
      avatar: '',
      lastMessage: 'When can we schedule a meeting?',
      time: 'Monday',
      unread: 0,
      messages: [
        { id: 1, sender: 'them', content: 'Hello, I\'m interested in your services', time: 'Monday, 9:00 AM' },
        { id: 2, sender: 'me', content: 'Hi Alex! I\'d be happy to discuss my services with you', time: 'Monday, 9:15 AM' },
        { id: 3, sender: 'them', content: 'Great! I need help with a logo design', time: 'Monday, 9:20 AM' },
        { id: 4, sender: 'them', content: 'When can we schedule a meeting?', time: 'Monday, 9:25 AM' },
      ]
    },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In a real app, you would send the message to an API
    console.log('Sending message:', messageInput);
    
    // Clear input after sending
    setMessageInput('');
  };

  return (
    <UnifiedDashboardLayout title="Messages">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="pb-3">
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Your recent messages</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto h-[calc(100%-7rem)]">
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`p-4 cursor-pointer hover:bg-accent/50 ${activeChat === conversation.id ? 'bg-accent' : ''}`}
                      onClick={() => setActiveChat(conversation.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="bg-brand-100 text-brand-800">
                            {getInitials(conversation.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">{conversation.name}</p>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <div className="bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Window */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              {activeChat !== null ? (
                <>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={conversations[activeChat].avatar} />
                        <AvatarFallback className="bg-brand-100 text-brand-800">
                          {getInitials(conversations[activeChat].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{conversations[activeChat].name}</CardTitle>
                        <CardDescription>Online</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations[activeChat].messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'me' 
                              ? 'bg-brand-500 text-white rounded-br-none' 
                              : 'bg-accent rounded-bl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Type your message..." 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
