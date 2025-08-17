'use client';

import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal, CornerDownLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full items-start gap-4"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about the document..."
        className="min-h-12 flex-1 resize-none pr-20 shadow-sm"
        rows={1}
        disabled={isLoading}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground p-2 rounded-md border bg-card hidden sm:flex items-center gap-1">
                        <CornerDownLeft className="h-3 w-3" />
                        <span>Send</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Press Enter to send</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim()}
          className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90"
        >
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
