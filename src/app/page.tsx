'use client';

import type { Document } from '@/lib/types';
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { DocumentArea } from '@/components/doc-upload/document-area';
import { Header } from '@/components/layout/header';
import { ChatPanel } from '@/components/chat/chat-panel';
import { Logo } from '@/components/logo';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(
    null
  );

  const activeDocument = documents.find((d) => d.id === activeDocumentId);

  return (
    <SidebarProvider>
      <Sidebar className="border-sidebar-border">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-sidebar-primary" />
            <h1 className="text-2xl font-headline font-bold text-sidebar-foreground">
              DocuChat AI
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <DocumentArea
            documents={documents}
            setDocuments={setDocuments}
            activeDocumentId={activeDocumentId}
            setActiveDocumentId={setActiveDocumentId}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-svh flex-col">
          <Header />
          <ChatPanel
            key={activeDocumentId} // Re-mounts ChatPanel when active document changes
            activeDocumentId={activeDocumentId}
            activeDocumentName={activeDocument?.name}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
