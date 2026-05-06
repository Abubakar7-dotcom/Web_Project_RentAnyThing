import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as chatbotService from '../services/chatbotService';
import * as complaintService from '../services/complaintService';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', content: 'Hi! I\'m the RentIt AI assistant. How can I help you today?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintDesc, setComplaintDesc] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatbotService.sendMessage(userInput);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Show complaint form if AI detected complaint intent
      if (result.isComplaintFlow) {
        setShowComplaintForm(true);
      }
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting. Please try again or contact support@rentit.com.',
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) return;

    try {
      setIsSubmittingComplaint(true);
      await complaintService.submitComplaint({ description: complaintDesc });

      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Your complaint has been submitted successfully! Our team will review it shortly.',
        isBot: true,
      };
      setMessages((prev) => [...prev, successMessage]);
      setShowComplaintForm(false);
      setComplaintDesc('');
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Failed to submit complaint. Please go to the Complaints page directly.',
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 w-16 h-16 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/30 flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-24 w-96 h-[520px] bg-card border border-border rounded-xl shadow-2xl z-30 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-accent text-white rounded-t-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">RentIt AI Support</h3>
              <p className="text-sm opacity-90">Powered by Groq AI</p>
            </div>
            <button
              onClick={() => navigate('/app/complaints')}
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              File Complaint
            </button>
          </div>

          {/* Messages */}
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

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}

            {/* Inline complaint form */}
            {showComplaintForm && (
              <div className="bg-muted rounded-lg p-3 border border-border">
                <p className="text-sm font-medium mb-2">Submit a Complaint</p>
                <form onSubmit={handleSubmitComplaint} className="space-y-2">
                  <textarea
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowComplaintForm(false)}
                      className="flex-1 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingComplaint || !complaintDesc.trim()}
                      className="flex-1 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors"
                    >
                      {isSubmittingComplaint ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
