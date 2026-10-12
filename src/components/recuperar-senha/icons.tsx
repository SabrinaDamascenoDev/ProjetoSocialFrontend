import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export function DecorativeIconBox({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: 2.5,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2.5,
      }}
    >
      {children}
    </Box>
  );
}

export function LockAtIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4.5" y="10" width="15" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.46-2" />
      <circle cx="12" cy="15.5" r="3.2" strokeWidth="1.4" />
      <path d="M11.1 14.4a1.3 1.3 0 0 1 1.9 1.1c0 .6-.4 1-.9 1.2l.3 1.4h-1.9l.3-1.4c-.5-.2-.9-.7-.9-1.2a1.3 1.3 0 0 1 1.2-1.1z" fill="#FFFFFF" stroke="none" />
    </svg>
  );
}

export function LockStarsIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <text
        x="12"
        y="13"
        textAnchor="middle"
        fontSize="13"
        fill="#FFFFFF"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        ***
      </text>
      <line
        x1="7"
        y1="17"
        x2="17"
        y2="17"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckPlainIcon({ color = '#4CAF50' }: { color?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ErrorCircleIcon({ color = '#D32F2F' }: { color?: string }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16.5" x2="12.01" y2="16.5" />
    </svg>
  );
}

export function InfoCircleIcon({ color = '#C77700' }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function LockSmallIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7A7A7A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function CheckSmallIcon({ color = '#7A7A7A' }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}