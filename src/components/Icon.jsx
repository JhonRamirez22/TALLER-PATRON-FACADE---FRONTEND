const paths = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M20 12H5m6 6-6-6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  bed: <><path d="M3 19v-8h18v8M3 15h18M6 11V7h5a3 3 0 0 1 3 3v1M3 19v2m18-2v2" /><path d="M17 11V8h2a2 2 0 0 1 2 2v1" /></>,
  spa: <><path d="M12 21c0-7 2-12 8-16-1 8-4 12-8 12" /><path d="M12 21c0-5-2-9-8-12 0 6 3 10 8 12M12 21v-7" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  car: <><path d="m5 11 1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" /><path d="M3 11h18v8H3zM3 15h18m-14 4v2m10-2v2" /><circle cx="6.5" cy="14" r=".5" /><circle cx="17.5" cy="14" r=".5" /></>,
  key: <><circle cx="8" cy="15" r="5" /><path d="m11.5 11.5 8-8 2 2-2 2 2 2-3 3-2-2-3 3" /></>,
  door: <><path d="M5 21V4l14-2v19M3 21h18" /><circle cx="15" cy="12" r=".7" /></>,
}

export default function Icon({ name, className = '' }) {
  return <svg aria-hidden="true" className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
