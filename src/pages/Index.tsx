import { DemoInterface } from "@/components/DemoInterface";
import { AIAssistant } from "@/components/AIAssistant";
import { TextProcessor } from "@/components/TextProcessor";
import { PromptLibrary } from "@/components/PromptLibrary";
import { DemoWorkflows } from "@/components/DemoWorkflows";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Settings, Play, Library } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Instant AI Buddy
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            AI assistance without tab switching - Get help exactly when and where you need it
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="processor" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Text Processor
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Prompt Library
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Workflows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-6">
            <DemoInterface />
          </TabsContent>

          <TabsContent value="processor" className="mt-6">
            <TextProcessor />
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <PromptLibrary />
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <DemoWorkflows />
          </TabsContent>
        </Tabs>
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Index;
