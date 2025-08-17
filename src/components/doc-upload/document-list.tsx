'use client';

import type { Document } from '@/lib/types';
import { FileText, FileJson, FileType, Scroll } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
}

function getFileIcon(type: Document['type']) {
  switch (type) {
    case 'PDF':
      return <FileType className="size-5 shrink-0 text-red-500" />;
    case 'TXT':
      return <FileText className="size-5 shrink-0 text-blue-500" />;
    case 'MD':
      return <FileJson className="size-5 shrink-0 text-green-500" />;
    default:
      return <FileText className="size-5 shrink-0" />;
  }
}

export function DocumentList({
  documents,
  activeDocumentId,
  setActiveDocumentId,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-sidebar-foreground/50">
        <Scroll className="mb-4 size-12" />
        <h3 className="text-lg font-semibold">No Documents</h3>
        <p className="max-w-xs text-sm">
          Upload your documents to start chatting with them.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <h3 className="mb-2 text-lg font-headline font-semibold text-sidebar-foreground">
        My Documents
      </h3>
      <ScrollArea className="flex-grow">
        <ul className="space-y-2 pr-4">
          {documents.map((doc) => (
            <li key={doc.id}>
              <button
                onClick={() => setActiveDocumentId(doc.id)}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-3 rounded-lg p-3 text-left transition-colors',
                  doc.id === activeDocumentId
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                )}
              >
                {getFileIcon(doc.type)}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{doc.name}</p>
                  <p
                    className={cn(
                      'text-xs',
                      doc.id === activeDocumentId
                        ? 'text-sidebar-accent-foreground/80'
                        : 'text-sidebar-foreground/60'
                    )}
                  >
                    {format(doc.createdAt, 'MMM d, yyyy')}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
