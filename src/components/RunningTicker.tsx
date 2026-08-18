import React from 'react';
import { BellRing, ChevronRight } from 'lucide-react';

interface RunningTickerProps {
  messages: string[];
  onAnnouncementClick?: () => void;
}

export const RunningTicker: React.FC<RunningTickerProps> = ({ messages, onAnnouncementClick }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="bg-amber-400 text-indigo-950 font-medium text-xs py-1.5 px-4 shadow-inner flex items-center overflow-hidden border-b border-amber-500">
      <div className="flex items-center gap-1 font-extrabold uppercase tracking-wider bg-indigo-950 text-amber-300 px-2 py-0.5 rounded text-[10px] mr-3 flex-shrink-0 border border-indigo-900 shadow-xs">
        <BellRing className="w-3 h-3 text-amber-400 animate-bounce" />
        <span>INFO UTAMA</span>
      </div>
      
      <div className="overflow-hidden relative flex-1 whitespace-nowrap">
        <div className="inline-block animate-marquee space-x-12">
          {messages.map((msg, index) => (
            <span key={index} className="inline-flex items-center gap-1.5 cursor-pointer hover:underline font-semibold text-xs" onClick={onAnnouncementClick}>
              <span>{msg}</span>
              <ChevronRight className="w-3.5 h-3.5 inline text-indigo-900" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
