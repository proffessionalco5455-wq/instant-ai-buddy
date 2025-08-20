import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { processText } from '@/lib/api';
import { useTextSelection } from '@/hooks/useKeyboardShortcut';
import { Copy, Wand2, Languages, FileText, Lightbulb } from 'lucide-react';

interface ProcessingOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  action: (text: string) => string;
}

export const TextProcessor = () => {
  const [selectedText, setSelectedText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { getSelectedText } = useTextSelection();
  const { toast } = useToast();

  const processingOptions: ProcessingOption[] = [
    {
      id: 'summarize',
      title: 'Summarize',
      icon: <FileText className="h-4 w-4" />,
      description: 'Create a concise summary',
      action: (text) => text
    },
    {
      id: 'rephrase',
      title: 'Rephrase',
      icon: <Wand2 className="h-4 w-4" />,
      description: 'Rewrite in different words',
      action: (text) => text
    },
    {
      id: 'translate',
      title: 'Translate',
      icon: <Languages className="h-4 w-4" />,
      description: 'Translate to another language',
      action: (text) => text
    },
    {
      id: 'expand',
      title: 'Expand',
      icon: <Lightbulb className="h-4 w-4" />,
      description: 'Add more detail and context',
      action: (text) => text
    }
  ];

  const handleGetSelection = () => {
    const selection = getSelectedText();
    if (selection) {
      setSelectedText(selection);
      toast({
        title: "Text Selected",
        description: `Captured ${selection.length} characters`
      });
    } else {
      toast({
        title: "No Selection",
        description: "Please select some text first",
        variant: "destructive"
      });
    }
  };

  const handleProcess = async (option: ProcessingOption) => {
    if (!selectedText) {
      toast({
        title: "No Text",
        description: "Please select or enter text first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const mode = option.id as 'summarize' | 'rephrase' | 'translate' | 'expand';
      const language = mode === 'translate' ? 'ES' : undefined;
      const res = await processText(mode, selectedText, language);
      setProcessedText(res.text);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Processing failed', variant: 'destructive' })
    }
    setIsProcessing(false);
    
    toast({
      title: "Processing Complete",
      description: `Text ${option.title.toLowerCase()}d successfully`
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Text Processor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button 
                onClick={handleGetSelection} 
                variant="outline" 
                size="sm"
              >
                Get Selected Text
              </Button>
              <Badge variant="secondary" className="ml-auto">
                {selectedText.length} characters
              </Badge>
            </div>
            <Textarea
              placeholder="Or type/paste text here..."
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {processingOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                onClick={() => handleProcess(option)}
                disabled={isProcessing}
                className="flex items-center gap-2 h-auto p-3 flex-col"
              >
                {option.icon}
                <span className="text-xs">{option.title}</span>
              </Button>
            ))}
          </div>

          {processedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Result:</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(processedText)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                {processedText}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Processing...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};