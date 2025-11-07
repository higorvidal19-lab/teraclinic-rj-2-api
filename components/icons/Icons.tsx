import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CalendarIcon = () => (
  <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="4" y1="11" x2="20" y2="11" />
    <line x1="11" y1="15" x2="12" y2="15" />
    <line x1="12" y1="15" x2="12" y2="18" />
  </svg>
);

export const UsersIcon = () => (
  <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </svg>
);

export const FileTextIcon = () => (
  <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <line x1="9" y1="9" x2="10" y2="9" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
);

export const DollarSignIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M17.8 20.817l-2.172 1.138a0.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a0.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.199a0.39 .39 0 0 1 .702 0l1.086 2.199l2.428 .352a0.389 .389 0 0 1 .217 .665l-1.757 1.707l.415 2.411a0.392 .392 0 0 1 -.568 .41l-2.172 -1.138z" />
        <path d="M6.2 20.817l-2.172 1.138a0.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a0.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.199a0.39 .39 0 0 1 .702 0l1.086 2.199l2.428 .352a0.389 .389 0 0 1 .217 .665l-1.757 1.707l.415 2.411a0.392 .392 0 0 1 -.568 .41l-2.172 -1.138z" />
    </svg>
);

export const WandIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M17.8 20.817l-2.172 1.138a0.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a0.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.199a0.39 .39 0 0 1 .702 0l1.086 2.199l2.428 .352a0.389 .389 0 0 1 .217 .665l-1.757 1.707l.415 2.411a0.392 .392 0 0 1 -.568 .41l-2.172 -1.138z" />
        <path d="M6.2 20.817l-2.172 1.138a0.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a0.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.199a0.39 .39 0 0 1 .702 0l1.086 2.199l2.428 .352a0.389 .389 0 0 1 .217 .665l-1.757 1.707l.415 2.411a0.392 .392 0 0 1 -.568 .41l-2.172 -1.138z" />
    </svg>
);

export const SendIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="10" y1="14" x2="21" y2="3" />
        <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
    </svg>
);

export const LogoutIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
        <path d="M7 12h14l-3 -3m0 6l3 -3" />
    </svg>
);

export const SettingsIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const UploadIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <polyline points="7 9 12 4 17 9" />
        <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
);

export const PlusIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export const ChevronLeftIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="15 6 9 12 15 18" />
    </svg>
);
  
export const ChevronRightIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="9 6 15 12 9 18" />
    </svg>
);

export const CreditCardIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="7" y1="15" x2="7.01" y2="15" />
        <line x1="11" y1="15" x2="13" y2="15" />
    </svg>
);