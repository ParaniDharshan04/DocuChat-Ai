'use client';

import type { Message, Citation } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { semanticSearchWithGemini } from '@/ai/flows/semantic-search-with-gemini';
import { useToast } from '@/hooks/use-toast';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatPanelProps {
  activeDocumentId: string | null;
  activeDocumentName?: string;
}

export function ChatPanel({ activeDocumentId, activeDocumentName }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activeDocumentId && activeDocumentName) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'system',
          content: `You are now chatting with **${activeDocumentName}**. Ask me anything about this document.`,
          createdAt: new Date(),
        },
      ]);
    } else {
       setMessages([
        {
          id: crypto.randomUUID(),
          role: 'system',
          content: `Welcome to DocuChat AI! Please upload and select a document from the left sidebar to begin.`,
          createdAt: new Date(),
        },
      ]);
    }
  }, [activeDocumentId, activeDocumentName]);

  const handleSendMessage = async (query: string) => {
    if (!activeDocumentId) {
      toast({
        variant: 'destructive',
        title: 'No Document Selected',
        description: 'Please select a document from the sidebar to chat with.',
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await semanticSearchWithGemini({
        query,
        documentId: activeDocumentId,
      });
      
      const combinedText = result.results.map(r => r.text).join('\n\n');
      const citations = result.results;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: combinedText.length > 0 ? combinedText : "I couldn't find any relevant information in the document.",
        citations: citations,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with semantic search:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'There was a problem getting a response. Please try again.',
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove optimistic user message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div className="border-t p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || !activeDocumentId}
        />
      </div>
    </div>
  );
}
