'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  content: string;
  subtext?: string;
  defaultOpen?: boolean;
}

export function AccordionSection({
  title,
  content,
  subtext,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[var(--border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 py-3 px-1 text-left hover:bg-[var(--bg-hover)] transition-colors"
      >
        <ChevronRight
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
        <span className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 px-1 pl-7">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content}</p>
          {subtext && (
            <p className="mt-2 text-xs text-[var(--text-muted)] italic">{subtext}</p>
          )}
        </div>
      )}
    </div>
  );
}
