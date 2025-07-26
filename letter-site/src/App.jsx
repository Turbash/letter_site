import LoveLetterGenerator from './components/LoveLetterGenerator';

export default function App() {
  return (
    <div
      className="min-h-screen h-full w-full flex flex-col items-center justify-center overflow-hidden bg-[#2d1a0d] bg-center bg-cover"
      style={{ backgroundImage: "url('/wood-material-background-wallpaper-texture-concept.webp')" }}
    >
      <LoveLetterGenerator />
    </div>
  );
}