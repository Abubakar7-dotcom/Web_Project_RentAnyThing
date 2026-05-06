import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import * as messageService from '../services/messageService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ChatPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<messageService.Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation from URL params or first conversation
  const [activeListingId, setActiveListingId] = useState(searchParams.get('listingId') || '');
  const [activeOtherUserId, setActiveOtherUserId] = useState(searchParams.get('userId') || '');

  const { messages, isLoading: isChatLoading, isConnected, sendMessage } = useChat(
    activeListingId,
    activeOtherUserId
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const data = await messageService.getConversations();
        setConversations(data);

        // Auto-select first conversation if none selected
        if (!activeListingId && data.length > 0) {
          const first = data[0];
          const otherId = first.senderId === user?.id ? first.receiverId : first.senderId;
          setActiveListingId(first.listingId);
          setActiveOtherUserId(otherId);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeListingId || !activeOtherUserId) return;
    await sendMessage(messageInput.trim());
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  };

  const getActiveConversationName = () => {
    const conv = conversations.find(
      (c) => c.listingId === activeListingId &&
        (c.senderId === activeOtherUserId || c.receiverId === activeOtherUserId)
    );
    if (!conv) return 'Conversation';
    const other = conv.senderId === user?.id ? conv.receiver : conv.sender;
    return `${other.name} — ${conv.listing.title}`;
  };

  return (
    <div className="h-screen flex">
      {/* Conversations sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No conversations yet.</p>
              <p className="text-xs mt-1">Message an owner from a product page.</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const otherId = conv.senderId === user?.id ? conv.receiverId : conv.senderId;
              const other = conv.senderId === user?.id ? conv.receiver : conv.sender;
              const isActive = conv.listingId === activeListingId && otherId === activeOtherUserId;

              return (
                <button
                  key={`${conv.listingId}_${otherId}`}
                  onClick={() => {
                    setActiveListingId(conv.listingId);
                    setActiveOtherUserId(otherId);
                  }}
                  className={`w-full p-4 border-b border-border hover:bg-muted transition-colors text-left ${
                    isActive ? 'bg-muted border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {conv.listing.media[0] && (
                      <img
                        src={conv.listing.media[0].url}
                        alt={conv.listing.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{other.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{conv.listing.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.content}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {!activeListingId ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-6 border-b border-border bg-card flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{getActiveConversationName()}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isConnected ? (
                    <>
                      <Wifi className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-500">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Connecting...</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isChatLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isSent = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg ${
                          isSent ? 'bg-primary text-white' : 'bg-muted text-foreground'
                        }`}
                      >
                        {!isSent && (
                          <p className="text-xs font-medium mb-1 opacity-70">{message.sender.name}</p>
                        )}
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isSent ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Enter to send)"
                  className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !isConnected}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
