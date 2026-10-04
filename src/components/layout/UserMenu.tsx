'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-10 w-24 animate-pulse rounded-full bg-[#2A2A2A]" />;
  }

  if (session?.user) {
    return (
      <div className="group relative">
        <button
          className={cn(
            'flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-[#2A2A2A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
          )}
          aria-label="User menu"
        >
          <img
            src={session.user.image || ''}
            alt={session.user.name || 'User'}
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#2A2A2A]"
          />
          <span className="hidden text-sm font-medium text-[#FFFFFF] md:inline-block">
            {session.user.name}
          </span>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 hidden w-48 flex-col rounded-md border border-[#2A2A2A] bg-[#141414] py-1 shadow-xl group-hover:flex">
          <div className="px-4 py-2 text-xs text-[#B3B3B3] border-b border-[#2A2A2A]">
            {session.user.email}
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center px-4 py-2 text-sm text-[#FFFFFF] hover:bg-[#2A2A2A] hover:text-primary transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(
        'flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-[#2A2A2A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
      )}
      aria-label="Login"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User className="h-4 w-4" />
      </div>
      <span className="hidden text-sm font-medium text-[#FFFFFF] md:inline-block">
        Login
      </span>
    </Link>
  );
}
