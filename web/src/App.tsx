import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { ShareFallback } from './pages/ShareFallback';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/s" element={<ShareFallback />} />
    </Routes>
  );
}
