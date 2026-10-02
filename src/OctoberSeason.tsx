import React from 'react';

/** Decorative only: no pricing, translations, links, storage, or business logic. */
export function AutumnLeaf({ className = '' }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    <path d="M39 7C26 6 12 10 10 23c-1 8 4 14 11 14C35 37 41 24 39 7Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7 42 32 16M15 33l-1-11m9 3 10-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>;
}

function Pumpkin() {
  return <svg width="62" height="56" viewBox="0 0 62 56" fill="none" aria-hidden="true" focusable="false">
    <path d="M31 15c-2-6-1-10 3-12l4 3c-4 2-5 5-4 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M33 10c7-6 14-5 18-1-7 4-13 4-18 1Z" fill="currentColor" fillOpacity=".20" />
    <path d="M31 17C20 8 5 17 5 32c0 14 10 21 20 17 4 3 9 3 13 0 10 4 19-3 19-17 0-15-14-24-26-15Z" fill="currentColor" fillOpacity=".10" stroke="currentColor" strokeWidth="1.8" />
    <ellipse cx="31" cy="33" rx="11" ry="18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M31 16v35" stroke="currentColor" strokeWidth="1.3" opacity=".6" />
  </svg>;
}

export function OctoberDetails({ variant }: { variant: 'device' | 'ultra' }) {
  return <div className={`oct-season-details oct-season-details-${variant}`} aria-hidden="true">
    <AutumnLeaf className="oct-season-leaf oct-season-leaf-one" />
    <AutumnLeaf className="oct-season-leaf oct-season-leaf-two" />
    {variant === 'device' && <span className="oct-season-pumpkin"><Pumpkin /></span>}
  </div>;
}
