
import { Routes, Route } from 'react-router-dom';
import LetterPage from './components/LetterPage';
import LoveLetterGenerator from './components/LoveLetterGenerator';
import HeartsBackground from './components/HeartsBackground';

export default function App() {
  return (
    <div
      className="min-h-screen h-full w-full flex flex-col items-center justify-center overflow-hidden bg-[#2d1a0d] bg-center bg-cover"
      style={{ backgroundImage: "url('/wood-material-background-wallpaper-texture-concept.webp')" }}
    >
      <HeartsBackground />
      <Routes>
        <Route path="/" element={<LoveLetterGenerator />} />
        <Route path="/letter" element={<LetterPage />} />
      </Routes>
    </div>
  );
}