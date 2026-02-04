import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;

export const useChatStream = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  onLeadCapture: () => void
) => {
  const [isTyping, setIsTyping] = useState(false);

  const streamChat = async (userMessages: { role: string; content: string }[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.isBot && last.id === "streaming") {
                return prev.map((m) =>
                  m.id === "streaming" ? { ...m, text: assistantContent } : m
                );
              }
              return [
                ...prev,
                {
                  id: "streaming",
                  text: assistantContent,
                  isBot: true,
                  timestamp: new Date(),
                },
              ];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Finalize the streaming message with a permanent ID
    setMessages((prev) =>
      prev.map((m) =>
        m.id === "streaming"
          ? { ...m, id: Date.now().toString() }
          : m
      )
    );

    // Check if response contains lead capture trigger
    if (assistantContent.includes("[COLLECT_LEAD]")) {
      onLeadCapture();
    }

    return assistantContent;
  };

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Build conversation history for context
    const conversationHistory = messages
      .filter((m) => m.id !== "1") // Exclude the initial greeting
      .map((m) => ({
        role: m.isBot ? "assistant" : "user",
        content: m.text,
      }));

    conversationHistory.push({ role: "user", content: text.trim() });

    try {
      await streamChat(conversationHistory);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      
      // Remove any streaming message
      setMessages((prev) => prev.filter((m) => m.id !== "streaming"));
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "I'm having trouble connecting right now. Please try again or contact us directly at hello@brightleadershipconsulting.com",
          isBot: true,
          timestamp: new Date(),
        },
      ]);

      if (errorMessage.includes("busy") || errorMessage.includes("rate")) {
        toast({
          title: "Please wait",
          description: "Our assistant is busy. Try again in a moment.",
          variant: "destructive",
        });
      }
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, setMessages]);

  return { isTyping, handleSend };
};
