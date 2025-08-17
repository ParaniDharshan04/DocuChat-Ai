'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="flex h-16 w-full items-center gap-4 border-b bg-card px-4 md:hidden">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Logo className="size-6 text-primary" />
        <h1 className="text-lg font-headline font-bold">DocuChat AI</h1>
      </div>
    </header>
  );
}
