"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { terms } from "@/lib/terms";
import { useEffect, useRef, useState } from "react";

export function ChatInterface() {
  const { setSlides, setCurrentView } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinish: async (message: any) => {
      // Check if the conversation is complete and we should generate slides
      // Handle both parts-based and content-based message structures
      const messageText = message.parts 
        ? message.parts
            .filter((part: { type: string }) => part.type === 'text')
            .map((part: { text: string }) => part.text)
            .join('')
        : message.content || '';
        
      if (messageText.toLowerCase().includes('slides') || 
          messageText.toLowerCase().includes('ներկայացում')) {
        // Parse slides from the response if needed
        // For now, we'll trigger slide generation through the old API
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const allMessages = messages.map((m: any) => {
            const text = m.parts
              ? m.parts
                  .filter((part: { type: string }) => part.type === 'text')
                  .map((part: { text: string }) => part.text)
                  .join('')
              : m.content || '';
            return { role: m.role, content: text };
          });
          
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: allMessages,
              action: "generate_slides",
            }),
          });
          
          const data = await response.json();
          if (data.slides) {
            setSlides(data.slides);
            setTimeout(() => setCurrentView("graph"), 1000);
          }
        } catch (error) {
          console.error("Error generating slides:", error);
        }
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === 'ready') {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center space-y-3 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            <CardTitle className="text-4xl font-bold">
              {terms.chatTitle}
            </CardTitle>
          </div>
          <CardDescription className="text-blue-100 text-lg">
            {terms.chatSubtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Messages */}
          <ScrollArea className="h-[500px] pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-20 space-y-4">
                  <Sparkles className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
                  <p className="text-xl font-medium">{terms.chatSubtitle}</p>
                  <p className="text-sm">{terms.chatPlaceholder}</p>
                  <div className="flex gap-2 justify-center flex-wrap mt-4">
                    <Badge variant="secondary" className="text-xs">
                      Ալբերտ Էյնշտեյն
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Մարի Քյուրի
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Լեոնարդո դա Վինչի
                    </Badge>
                  </div>
                </div>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                messages.map((message: any) => {
                  const messageText = message.parts
                    ? message.parts
                        .filter((part: { type: string }) => part.type === 'text')
                        .map((part: { text: string }) => part.text)
                        .join('')
                    : message.content || '';
                    
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-md transition-all hover:shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "bg-white text-slate-900 border border-slate-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {messageText}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm">{terms.generating}</span>
                    </div>
                    <div className="space-y-2 mt-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={terms.chatPlaceholder}
              disabled={isLoading}
              className="flex-1 h-12 text-base border-slate-300 focus-visible:ring-blue-600"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="lg"
              className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

