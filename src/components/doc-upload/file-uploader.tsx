'use client';

import React from 'react';
import { UploadCloud, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface FileUploaderProps {
  onFileChange: (files: FileList | null) => void;
  isUploading: boolean;
}

export function FileUploader({ onFileChange, isUploading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onFileChange(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files);
  };

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-sidebar-accent/50 bg-sidebar-accent/10 p-8 text-center text-sidebar-foreground/80 transition-colors hover:border-sidebar-accent/80 hover:bg-sidebar-accent/20',
        isDragging && 'border-sidebar-accent/80 bg-sidebar-accent/20'
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleInputChange}
        accept=".pdf,.txt,.md"
        disabled={isUploading}
      />
      {isUploading ? (
        <>
          <LoaderCircle className="mb-4 size-10 animate-spin text-sidebar-primary" />
          <p className="font-semibold">Processing documents...</p>
          <p className="text-sm text-sidebar-foreground/60">
            Please wait while we prepare your files.
          </p>
        </>
      ) : (
        <>
          <UploadCloud className="mb-4 size-10 text-sidebar-primary transition-transform group-hover:scale-110" />
          <p className="font-semibold">Drag & drop files or click to upload</p>
          <p className="text-sm text-sidebar-foreground/60">
            Supports PDF, TXT, MD
          </p>
        </>
      )}
    </div>
  );
}
