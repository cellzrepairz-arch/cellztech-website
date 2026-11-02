import React from 'react';

/** Decorative only: no pricing, translations, links, storage, or business logic. */
export function AutumnLeaf({ className = '' }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    <path d="M39 7C26 6 12 10 10 23c-1 8 4 14 11 14C35 37 41 24 39 7Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7 42 32 16M15 33l-1-11m9 3 10-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>;
}

/** Quiet November accents; always behind content and never interactive. */
export function SeasonDetails({ variant }: { variant: 'device' | 'ultra' }) {
  return <div className={`nov-autumn-details nov-autumn-${variant}`} aria-hidden="true">
    <AutumnLeaf className="nov-autumn-leaf-one" />
    <AutumnLeaf className="nov-autumn-leaf-two" />
  </div>;
}
