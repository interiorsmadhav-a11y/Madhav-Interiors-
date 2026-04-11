import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! Welcome to Madhav Interiors. How can we help you design your dream space today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputValue, isBot: false }];
    setMessages(newMessages);
    setInputValue("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thanks for reaching out! A design consultant will be with you shortly. Please leave your email or phone number so we can get back to you.",
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <div
        className={cn(
          "bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right mb-4 flex flex-col",
          isOpen ? "scale-100 opacity-100 w-80 h-96" : "scale-0 opacity-0 w-0 h-0"
        )}
      >
        {/* Header */}
        <div className="bg-brand-charcoal text-white p-4 flex justify-between items-center">
          <div>
            <h4 className="font-serif font-medium">Madhav Interiors</h4>
            <p className="text-xs text-white/70">We typically reply in a few minutes</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <Minus size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-brand-ivory/30 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.isBot ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm",
                  msg.isBot
                    ? "bg-white border border-brand-charcoal/10 text-brand-charcoal rounded-tl-sm"
                    : "bg-brand-wood text-white rounded-tr-sm"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-brand-charcoal/10 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-brand-ivory/50 border border-brand-charcoal/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-wood transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-brand-charcoal text-white p-2 rounded-full disabled:opacity-50 hover:bg-brand-wood transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "bg-brand-charcoal text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center",
          isOpen && "bg-brand-wood"
        )}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
