'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, selectSearchQuery } from '@/features/ui/uiSlice';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const globalQuery = useAppSelector(selectSearchQuery);
  const [query, setQuery] = useState(globalQuery);
  const [isFocused, setIsFocused] = useState(false);

  const [prevGlobalQuery, setPrevGlobalQuery] = useState(globalQuery);

  // Sync local query if global changes from elsewhere
  if (globalQuery !== prevGlobalQuery) {
    setPrevGlobalQuery(globalQuery);
    setQuery(globalQuery);
  }

  // Debounce dispatching to Redux
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== globalQuery) {
        dispatch(setSearchQuery(query));
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, globalQuery, dispatch]);

  return (
    <div
      className={cn(
        'group relative flex w-full max-w-md items-center rounded-sm border transition-all duration-200 ease-in-out',
        isFocused 
          ? 'border-[#E50914] bg-[#141414] ring-1 ring-[#E50914]/50 shadow-sm' 
          : 'border-[#2A2A2A] bg-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-[#333333]'
      )}
    >
      <Search 
        className={cn(
          "ml-3 mr-2 h-4 w-4 shrink-0 transition-colors duration-200",
          isFocused ? "text-[#E50914]" : "text-[#B3B3B3] group-hover:text-[#FFFFFF]"
        )} 
      />
      <input
        type="text"
        placeholder="Search content..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent py-2 text-sm text-[#FFFFFF] outline-none placeholder:text-[#888888]"
        aria-label="Search content"
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            dispatch(setSearchQuery(''));
          }}
          className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[#B3B3B3] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur before clearing
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
