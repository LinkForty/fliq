import { Link } from 'react-router-dom';
import { APP_STORE_URL, PLAY_STORE_URL } from '../constants';

function getStoreUrl(): string {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod|Macintosh/i.test(ua)) return APP_STORE_URL;
  return PLAY_STORE_URL;
}

export function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/fliq-logo.png" alt="Fliq" className="size-8 rounded-lg shadow-lg shadow-primary/40" />
          <span className="text-xl font-bold tracking-tight text-white">Fliq</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <a className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="#features">Features</a>
          <a className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
          <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" to="/privacy">Privacy</Link>
          <a
            href={getStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:brightness-110 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25"
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
