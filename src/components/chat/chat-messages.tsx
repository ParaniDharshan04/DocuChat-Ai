'use client';

import type { Message, Citation } from '@/lib/types';
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Info, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

function CitationBadge({ citation }: { citation: Citation }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="ml-1 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
          >
            <FileText className="mr-1 h-3 w-3" />
            {citation.citation}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side="top">
          <p className="font-bold mb-1">Source:</p>
          <p className="text-muted-foreground">{citation.text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


function AssistantMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-9 w-9 border">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-lg bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold text-primary mb-2">DocuChat AI</p>
        <div className="prose-sm max-w-none text-foreground">
            {message.content}
            <div className="mt-4 flex flex-wrap gap-2">
                {message.citations && message.citations.length > 0 && (
                     <p className="text-xs font-bold text-muted-foreground w-full">Sources:</p>
                )}
                {message.citations?.map((c, i) => <CitationBadge key={i} citation={c} />)}
            </div>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
    return (
      <div className="flex items-start gap-4 flex-row-reverse">
        <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-accent text-accent-foreground">
            <User className="h-5 w-5" />
            </AvatarFallback>
        </Avatar>
        <div className="flex-1 rounded-lg bg-accent/20 p-4">
            <p className="text-sm font-semibold text-accent-foreground mb-2 text-right">You</p>
            <div className="prose-sm max-w-none text-foreground text-right">
                {message.content}
            </div>
        </div>
      </div>
    )
}

function SystemMessage({ message }: { message: Message }) {
    return (
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs p-4">
            <Info className="h-4 w-4"/>
            <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
    )
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((msg) => {
            switch(msg.role) {
                case 'user': return <UserMessage key={msg.id} message={msg} />;
                case 'assistant': return <AssistantMessage key={msg.id} message={msg} />;
                case 'system': return <SystemMessage key={msg.id} message={msg} />;
                default: return null;
            }
          })}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-lg bg-card p-4 shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="h-2.5 w-2.5 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="h-2.5 w-2.5 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
