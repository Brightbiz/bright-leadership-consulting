import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "@/components/chat/ChatMessage";
import LeadCaptureForm from "@/components/chat/LeadCaptureForm";
import { useChatStream } from "@/components/chat/useChatStream";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const STORAGE_KEY = "bbs-chat-history";
const INITIAL_MESSAGE: Message = {
  id: "1",
  text: "👋 Hi! I'm your Leadership Assistant. How can I help you with your leadership journey today?",
  isBot: true,
  timestamp: new Date(),
};

const quickReplies = [
  "Tell me about coaching",
  "What programs do you offer?",
  "How do I book a consultation?",
];

const loadMessagesFromStorage = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    }
  } catch (e) {
    console.error("Failed to load chat history:", e);
  }
  return [INITIAL_MESSAGE];
};

const saveMessagesToStorage = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat history:", e);
  }
};

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessagesFromStorage);
  const [inputValue, setInputValue] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isTyping, handleSend } = useChatStream(
    messages,
    setMessages,
    () => setShowLeadForm(true)
  );

  // Persist messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0 && !messages.some((m) => m.id === "streaming")) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  const clearHistory = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setShowLeadForm(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showLeadForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
    setInputValue("");
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleLeadSuccess = (name: string) => {
    setShowLeadForm(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Thank you, ${name}! 🎉 Our team will reach out within 24 hours to schedule your free discovery call. In the meantime, feel free to ask me any other questions!`,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  const handleLeadCancel = () => {
    setShowLeadForm(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "No problem! Feel free to share your details whenever you're ready, or you can always reach us at hello@brightleadershipconsulting.com or call 0333 335 5045.",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-shadow"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm"
          >
            <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/90 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">
                      Leadership Assistant
                    </h3>
                    <p className="text-xs text-primary-foreground/70">
                      Powered by AI • Usually replies instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 1 && (
                    <button
                      onClick={clearHistory}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      title="Start new conversation"
                    >
                      <RotateCcw className="h-4 w-4 text-primary-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5 text-primary-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 min-h-[200px]">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isTyping && !messages.some((m) => m.id === "streaming") && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                {showLeadForm && (
                  <LeadCaptureForm
                    onSuccess={handleLeadSuccess}
                    onCancel={handleLeadCancel}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && !isTyping && !showLeadForm && (
                <div className="px-4 py-2 border-t border-border/50 bg-card/50">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-border/50 bg-card"
              >
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 h-10"
                    disabled={isTyping || showLeadForm}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="default"
                    disabled={!inputValue.trim() || isTyping || showLeadForm}
                    className="h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatWidget;
