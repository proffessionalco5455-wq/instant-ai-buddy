import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Keyboard, 
  Library, 
  Bot,
  Sparkles,
  Globe,
  Clock,
  Shield
} from "lucide-react";

export const DemoInterface = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-ai rounded-xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-ai-primary to-ai-secondary bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your instant AI companion that works anywhere on the web. Get help without leaving your current task.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Badge variant="outline" className="gap-2 py-2 px-4 text-sm">
              <Keyboard className="w-4 h-4" />
              Ctrl+Space to activate
            </Badge>
            <Badge variant="outline" className="gap-2 py-2 px-4 text-sm">
              <Zap className="w-4 h-4" />
              Instant responses
            </Badge>
            <Badge variant="outline" className="gap-2 py-2 px-4 text-sm">
              <Library className="w-4 h-4" />
              Prompt library
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 glass border-overlay-border hover:shadow-ai transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ai-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-ai-primary" />
              </div>
              <h3 className="text-lg font-semibold">Instant Access</h3>
            </div>
            <p className="text-muted-foreground">
              Press Ctrl+Space anywhere to open your AI assistant overlay. No tab switching required.
            </p>
          </Card>

          <Card className="p-6 glass border-overlay-border hover:shadow-ai transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ai-secondary/20 rounded-lg">
                <Library className="w-5 h-5 text-ai-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Prompt Library</h3>
            </div>
            <p className="text-muted-foreground">
              Save and reuse your favorite prompts. Built-in templates for common tasks like summarizing and translating.
            </p>
          </Card>

          <Card className="p-6 glass border-overlay-border hover:shadow-ai transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ai-accent/20 rounded-lg">
                <Globe className="w-5 h-5 text-ai-accent" />
              </div>
              <h3 className="text-lg font-semibold">Universal Tool</h3>
            </div>
            <p className="text-muted-foreground">
              Works on any website. Perfect for professionals, students, and content creators.
            </p>
          </Card>

          <Card className="p-6 glass border-overlay-border hover:shadow-ai transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-success/20 rounded-lg">
                <Clock className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-lg font-semibold">Save Time</h3>
            </div>
            <p className="text-muted-foreground">
              No more context switching. Get AI help while staying focused on your current work.
            </p>
          </Card>

          <Card className="p-6 glass border-overlay-border hover:shadow-ai transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ai-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-ai-primary" />
              </div>
              <h3 className="text-lg font-semibold">Privacy First</h3>
            </div>
            <p className="text-muted-foreground">
              Your data stays secure. Local storage for prompts and privacy-focused design.
            </p>
          </Card>

          <Card className="p-6 glass border-overlay-border hover:shadow-ai transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ai-secondary/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-ai-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Smart Assistance</h3>
            </div>
            <p className="text-muted-foreground">
              Summarize, rephrase, translate, brainstorm, and more. Your AI companion for any task.
            </p>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="text-center">
          <Card className="p-8 glass border-overlay-border max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Try it now!</h2>
            <p className="text-muted-foreground mb-6">
              Click the floating AI button in the bottom-right corner or press <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl+Space</kbd> to experience the magic.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">Summarize</div>
                <div className="text-xs text-muted-foreground">Condense long text</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">Rephrase</div>
                <div className="text-xs text-muted-foreground">Improve writing</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">Translate</div>
                <div className="text-xs text-muted-foreground">Any language</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">Brainstorm</div>
                <div className="text-xs text-muted-foreground">Generate ideas</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sample text for testing */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Sample Content to Test With</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 glass border-overlay-border">
              <h3 className="font-semibold mb-3">Long Article (for summarizing)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Artificial intelligence has revolutionized how we approach problem-solving in the modern world. 
                From healthcare diagnostics to financial trading, AI systems are increasingly becoming integral 
                to our daily operations. Machine learning algorithms can process vast amounts of data in seconds, 
                identifying patterns that would take humans weeks or months to discover. This technological 
                advancement has opened new possibilities for innovation across industries. However, with great 
                power comes great responsibility, and we must ensure that AI development remains ethical and 
                beneficial for all humanity. The future of AI looks promising, but it requires careful planning 
                and consideration of its societal impact.
              </p>
            </Card>
            
            <Card className="p-6 glass border-overlay-border">
              <h3 className="font-semibold mb-3">Casual Text (for rephrasing)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hey, so I was thinking about this project and I think we should probably move forward with it. 
                The thing is, we need to get more people involved because it's getting kinda complex. Maybe we 
                could set up a meeting or something to talk about it? I'm not sure about the timeline but I 
                think if we work together we can figure it out. Let me know what you think!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};