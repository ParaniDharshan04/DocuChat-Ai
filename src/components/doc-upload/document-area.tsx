'use client';

import type { Document } from '@/lib/types';
import React from 'react';
import { generateEmbeddings } from '@/ai/flows/generate-embeddings';
import { useToast } from '@/hooks/use-toast';
import { FileUploader } from './file-uploader';
import { DocumentList } from './document-list';
import { Separator } from '@/components/ui/separator';

interface DocumentAreaProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
}

export function DocumentArea({
  documents,
  setDocuments,
  activeDocumentId,
  setActiveDocumentId,
}: DocumentAreaProps) {
  const [uploading, setUploading] = React.useState(false);
  const { toast } = useToast();

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileType = file.name.split('.').pop()?.toUpperCase();
        if (!fileType || !['PDF', 'TXT', 'MD'].includes(fileType)) {
          toast({
            variant: 'destructive',
            title: 'Unsupported File Type',
            description: `File type .${fileType?.toLowerCase()} is not supported.`,
          });
          continue;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise<void>((resolve, reject) => {
          reader.onload = async () => {
            const fileContent = reader.result as string;
            
            await generateEmbeddings({
              fileContent,
              fileName: file.name,
              fileType: file.type,
            });

            const newDocument: Document = {
              id: crypto.randomUUID(),
              name: file.name,
              type: fileType as 'PDF' | 'TXT' | 'MD',
              createdAt: new Date(),
            };

            setDocuments((prev) => [...prev, newDocument]);
            setActiveDocumentId(newDocument.id);
            resolve();
          };
          reader.onerror = (error) => reject(error);
        });
      }

      toast({
        title: 'Upload successful',
        description: `${files.length} document(s) have been processed.`,
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was a problem processing your documents.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-full flex-col p-4 pt-0">
      <FileUploader
        onFileChange={handleFileChange}
        isUploading={uploading}
      />
      <Separator className="my-4 bg-sidebar-border" />
      <DocumentList
        documents={documents}
        activeDocumentId={activeDocumentId}
        setActiveDocumentId={setActiveDocumentId}
      />
    </div>
  );
}
