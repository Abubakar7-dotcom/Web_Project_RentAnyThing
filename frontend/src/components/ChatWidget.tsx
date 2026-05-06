import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', content: 'Hi! How can I help you today?', isBot: true },
  ]);
  const [input, setInput] = useState('');

  const faqResponses: Record<string, string> = {
    'how does renting work': 'Browse items, select dates, and confirm your rental. The owner will approve and you can pick up the item!',
    'how do i list an item': 'Click "Rent Out" in the sidebar, fill in the details, upload photos, and set your price. It\'s that simple!',
    'what payment methods': 'We accept all major credit cards, debit cards, and PayPal for secure transactions.',
    'how do i cancel': 'Go to your rentals page, select the rental, and click "Cancel". Cancellations are free if done 24 hours before pickup.',
    'contact support': 'You can reach our support team at support@rentit.com or call 1-800-RENT-IT.',
    'complaint': 'To submit a complaint, please describe your issue and I\'ll help you file it.',
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Find matching FAQ response
    const lowerInput = input.toLowerCase();
    let response = 'I couldn\'t find an answer to that. Please contact support at support@rentit.com for assistance.';
    
    for (const [key, value] of Object.entries(faqResponses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/30 flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[500px] bg-card border border-border rounded-xl shadow-2xl z-30 flex flex-col">
          <div className="p-4 border-b border-border bg-accent text-white rounded-t-xl">
            <h3 className="font-bold text-lg">RentIt Support</h3>
            <p className="text-sm opacity-90">Ask me anything!</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-accent text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
