import { Check, X } from 'lucide-react';

interface RequirementCardProps {
  label: string;
  passed: boolean;
  detail?: string;
}

export default function RequirementCard({ label, passed, detail }: RequirementCardProps) {
  return (
    <div
      className={`
        flex items-start gap-3 p-3 border rounded-md shadow-sm
        ${passed ? 'bg-gray-50 border-black' : 'bg-[#fef2f2] border-[#ef4444]'}
      `}
    >
      {/* Icon */}
      <div
        className={`
          shrink-0 h-6 w-6 rounded-full flex items-center justify-center
          ${passed ? 'bg-[#42B0A8]/20 text-[#42B0A8]' : 'bg-[#ef4444]/20 text-[#ef4444]'}
        `}
      >
        {passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className={`text-sm font-medium leading-tight ${passed ? 'text-black' : 'text-[#ef4444]'}`}>
          {label}
        </p>
        {detail && (
          <p className={`text-xs mt-0.5 ${passed ? 'text-gray-500' : 'text-[#ef4444]/80'}`}>
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}
