import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutProps {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcut = ({
  key,
  ctrlKey = false,
  shiftKey = false,
  altKey = false,
  callback,
  enabled = true,
}: UseKeyboardShortcutProps) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = event.ctrlKey === ctrlKey;
      const shiftMatch = event.shiftKey === shiftKey;
      const altMatch = event.altKey === altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }
    },
    [key, ctrlKey, shiftKey, altKey, callback, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
};

// Text selection hook
export const useTextSelection = () => {
  const getSelectedText = useCallback(() => {
    if (window.getSelection) {
      const selection = window.getSelection();
      return selection?.toString() || '';
    }
    return '';
  }, []);

  const clearSelection = useCallback(() => {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  }, []);

  return { getSelectedText, clearSelection };
};

// Local storage hook for prompts
export const usePromptStorage = () => {
  const savePrompt = useCallback((prompt: { title: string; content: string; category: string }) => {
    const existingPrompts = localStorage.getItem('ai-buddy-prompts');
    const prompts = existingPrompts ? JSON.parse(existingPrompts) : [];
    
    const newPrompt = {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    prompts.push(newPrompt);
    localStorage.setItem('ai-buddy-prompts', JSON.stringify(prompts));
    return newPrompt;
  }, []);

  const getPrompts = useCallback(() => {
    const existingPrompts = localStorage.getItem('ai-buddy-prompts');
    return existingPrompts ? JSON.parse(existingPrompts) : [];
  }, []);

  const deletePrompt = useCallback((id: string) => {
    const existingPrompts = localStorage.getItem('ai-buddy-prompts');
    if (!existingPrompts) return;
    
    const prompts = JSON.parse(existingPrompts);
    const filteredPrompts = prompts.filter((p: any) => p.id !== id);
    localStorage.setItem('ai-buddy-prompts', JSON.stringify(filteredPrompts));
  }, []);

  return { savePrompt, getPrompts, deletePrompt };
};