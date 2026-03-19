import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-navy text-gray-400 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} SiteTransition LLC
          </div>
          <nav className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <a
              href="https://github.com/linkforty/fliq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkforty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkForty
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
