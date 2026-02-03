import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  // Remove the [COLLECT_LEAD] marker from displayed text
  const displayText = message.text.replace(/\[COLLECT_LEAD\]/g, "").trim();

  return (
    <div
      className={cn(
        "flex",
        message.isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          message.isBot
            ? "bg-card border border-border/50 text-foreground rounded-bl-sm"
            : "bg-primary text-primary-foreground rounded-br-sm"
        )}
      >
        {displayText}
      </div>
    </div>
  );
};

export default ChatMessage;
