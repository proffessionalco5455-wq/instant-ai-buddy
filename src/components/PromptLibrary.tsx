import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePromptStorage } from '@/hooks/useKeyboardShortcut';
import { Plus, Search, Trash2, Copy, Tag } from 'lucide-react';

interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const categories = ['Writing', 'Translation', 'Analysis', 'Creative', 'Technical', 'Business'];

export const PromptLibrary = () => {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPrompt, setNewPrompt] = useState({ title: '', content: '', category: 'Writing' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { savePrompt, getPrompts, deletePrompt } = usePromptStorage();
  const { toast } = useToast();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = () => {
    const savedPrompts = getPrompts();
    setPrompts(savedPrompts);
  };

  const handleSavePrompt = () => {
    if (!newPrompt.title || !newPrompt.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const saved = savePrompt(newPrompt);
    setPrompts(prev => [...prev, saved]);
    setNewPrompt({ title: '', content: '', category: 'Writing' });
    setIsDialogOpen(false);
    
    toast({
      title: "Prompt Saved",
      description: "Your prompt has been added to the library"
    });
  };

  const handleDeletePrompt = (id: string) => {
    deletePrompt(id);
    setPrompts(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Prompt Deleted",
      description: "Prompt removed from library"
    });
  };

  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard"
    });
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Prompt Library
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prompt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save New Prompt</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Prompt title..."
                    value={newPrompt.title}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Select
                    value={newPrompt.category}
                    onValueChange={(value) => setNewPrompt(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Enter your prompt content..."
                    value={newPrompt.content}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                  <Button onClick={handleSavePrompt} className="w-full">
                    Save Prompt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No prompts found</p>
                <p className="text-sm">Create your first prompt to get started</p>
              </div>
            ) : (
              filteredPrompts.map(prompt => (
                <Card key={prompt.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">{prompt.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {prompt.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {prompt.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(prompt.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyPrompt(prompt.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};