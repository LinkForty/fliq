import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-background-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-6 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-sm font-bold">vibration</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Fliq</h2>
            </div>
            <p className="text-slate-500 text-sm font-light">&copy; {new Date().getFullYear()} SiteTransition LLC. All rights reserved.</p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</p>
              <Link className="text-sm text-slate-500 hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
              <Link className="text-sm text-slate-500 hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Open Source</p>
              <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="https://github.com/linkforty/fliq" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="https://linkforty.com" target="_blank" rel="noopener noreferrer">LinkForty</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
