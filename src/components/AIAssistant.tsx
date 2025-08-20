import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Library, 
  Plus, 
  Star,
  Copy,
  Check,
  Zap,
  Brain,
  FileText,
  Languages,
  Scissors
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { chat } from "@/lib/api";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Summarize Text',
    content: 'Please summarize the following text in 2-3 bullet points:',
    category: 'Productivity',
    icon: <FileText className="w-4 h-4" />,
    popular: true
  },
  {
    id: '2', 
    title: 'Rephrase & Improve',
    content: 'Please rephrase and improve the following text to make it more professional and clear:',
    category: 'Writing',
    icon: <Scissors className="w-4 h-4" />,
    popular: true
  },
  {
    id: '3',
    title: 'Translate',
    content: 'Please translate the following text to [language]:',
    category: 'Language',
    icon: <Languages className="w-4 h-4" />
  },
  {
    id: '4',
    title: 'Generate Ideas',
    content: 'Generate 5 creative ideas for:',
    category: 'Creativity',
    icon: <Brain className="w-4 h-4" />
  }
];

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>(samplePrompts);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const res = await chat(userMessage);
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: res.text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to get AI response', variant: 'destructive' })
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    await simulateAIResponse(inputValue);
  };

  const handleUsePrompt = (prompt: Prompt) => {
    setInputValue(prompt.content);
    setShowPromptLibrary(false);
    inputRef.current?.focus();
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied successfully",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-glow bg-gradient-ai hover:scale-105 transition-all duration-300 pulse-glow"
        >
          <Bot className="w-6 h-6" />
        </Button>
        <div className="absolute -top-12 right-0 glass rounded-lg px-3 py-2 text-sm animate-in">
          Press Ctrl+Space
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <Card className="w-full max-w-2xl h-[600px] glass border-overlay-border shadow-overlay animate-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-overlay-border bg-gradient-ai rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                <p className="text-sm text-white/70">Your instant AI companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPromptLibrary(!showPromptLibrary)}
                className="text-white hover:bg-white/20"
              >
                <Library className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Prompt Library */}
          {showPromptLibrary && (
            <div className="p-4 border-b border-overlay-border bg-muted/20">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Quick Prompts
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {savedPrompts.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleUsePrompt(prompt)}
                    className="justify-start gap-2 h-auto p-3 text-left border-overlay-border hover:bg-overlay"
                  >
                    {prompt.icon}
                    <div>
                      <div className="font-medium text-xs">{prompt.title}</div>
                      {prompt.popular && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Ready to assist!</h3>
                <p className="text-muted-foreground mb-4">
                  Ask me anything or use a quick prompt from the library.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="gap-1">
                    <Zap className="w-3 h-3" />
                    Fast responses
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Brain className="w-3 h-3" />
                    Smart assistance
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 relative group ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-overlay border border-overlay-border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-overlay border border-overlay-border rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-overlay-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything... (Ctrl+Space to open)"
                className="flex-1 bg-overlay border-overlay-border focus:ring-ai-primary"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-ai hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Press Ctrl+Space to reopen</span>
              <span>•</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};