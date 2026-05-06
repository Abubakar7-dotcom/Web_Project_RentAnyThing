import { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isSent: boolean;
}

export function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    { id: '1', name: 'PhotoPro Studio', lastMessage: 'The camera is available!', unread: 2 },
    { id: '2', name: 'TechRent Pro', lastMessage: 'When do you need it?', unread: 0 },
    { id: '3', name: 'GameZone', lastMessage: 'Thanks for renting!', unread: 0 },
  ];

  const messages: Message[] = [
    {
      id: '1',
      content: 'Hi! Is the Sony A7 III still available?',
      senderId: 'me',
      senderName: 'You',
      timestamp: '10:30 AM',
      isSent: true,
    },
    {
      id: '2',
      content: 'Yes, it is! When would you like to rent it?',
      senderId: 'owner1',
      senderName: 'PhotoPro Studio',
      timestamp: '10:32 AM',
      isSent: false,
    },
    {
      id: '3',
      content: 'I need it for next weekend. Does it come with extra batteries?',
      senderId: 'me',
      senderName: 'You',
      timestamp: '10:35 AM',
      isSent: true,
    },
    {
      id: '4',
      content: 'Perfect! Yes, I include 2 extra batteries and a charger with every rental.',
      senderId: 'owner1',
      senderName: 'PhotoPro Studio',
      timestamp: '10:36 AM',
      isSent: false,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // Mock send
      alert('Message sent!');
      setMessageInput('');
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-80 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 border-b border-border hover:bg-muted transition-colors text-left ${
                selectedConversation === conv.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold">{conv.name}</h3>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {conv.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="text-xl font-bold">PhotoPro Studio</h2>
          <p className="text-sm text-muted-foreground">Usually replies within an hour</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  message.isSent
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.isSent ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-6 border-t border-border bg-card">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
