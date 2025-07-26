import React, { useRef, useState } from "react";

function splitMessagePages(message, maxLen = 300) {
  if (!message) return [];
  const pages = [];
  let i = 0;
  while (i < message.length) {
    let chunk = message.slice(i, i + maxLen);
    if (i + maxLen < message.length) {
      const lastSpace = chunk.lastIndexOf(' ');
      if (lastSpace > 50) chunk = chunk.slice(0, lastSpace);
    }
    pages.push(chunk.trim());
    i += chunk.length;
  }
  return pages;
}

const LetterDisplay = ({ to, from, letter, onEdit }) => {
  const [page, setPage] = useState(0);
  const pages = splitMessagePages(letter);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 60 && page > 0) setPage(page - 1);
    else if (dx < -60 && page < pages.length - 1) setPage(page + 1);
    touchStartX.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' && page > 0) setPage(page - 1);
    if (e.key === 'ArrowRight' && page < pages.length - 1) setPage(page + 1);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const overlayBg = isMobile ? {
    backgroundImage: `url('/11488228.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-10"
      style={overlayBg}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative flex items-center justify-center"
        style={isMobile
          ? { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh', aspectRatio: '9/16' }
          : { width: 'min(92vw, 420px)', aspectRatio: '9/16', maxHeight: '92vh' }}
      >
        {!isMobile && (
          <img
            src="/11488228.png"
            alt="Paper"
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            draggable="false"
            style={{ zIndex: 0 }}
          />
        )}
        <div
          className="relative flex flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-8 text-[#2d1a0d] font-allura w-full h-full overflow-auto"
          style={{ fontFamily: 'Allura, cursive', zIndex: 1 }}
        >
          <div className="w-full flex flex-col justify-evenly items-center max-h-[70%]">
            <div className="text-pink-700 mb-3 text-left text-[1.3rem] sm:text-[1.7rem] w-full px-6 sm:px-12 break-words break-all overflow-hidden" style={{ wordBreak: 'break-word' }}>
              Dear {to},
            </div>
            <div
              className="whitespace-pre-line mb-2 flex-1 text-center break-words text-[1.1rem] sm:text-[1.4rem] leading-tight max-h-[60%] overflow-hidden break-all font-allura w-full px-6 sm:px-12"
              style={{ fontFamily: 'Allura, cursive', minHeight: '3em', wordBreak: 'break-word' }}
            >
              {pages[page]}
            </div>
            <div className="text-pink-700 mt-1 mb-2 text-right w-full text-[1.1rem] sm:text-[1.4rem] px-6 sm:px-12 break-words break-all overflow-hidden" style={{ wordBreak: 'break-word', marginTop: '0.5rem' }}>
              Yours, {from}
            </div>
          </div>
          <button onClick={onEdit} className="absolute top-4 right-4 bg-white text-pink-700 border border-yellow-300 rounded px-3 py-1 font-pacifico cursor-pointer text-base">Edit</button>
          {pages.length > 1 && (
            <div className="flex justify-center items-center gap-6 mt-2 w-full">
              <button onClick={() => setPage(page - 1)} disabled={page === 0} className={`text-pink-700 text-xl bg-transparent border-none ${page === 0 ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>&lt; Prev</button>
              <span className="text-pink-700 font-pacifico text-lg">Page {page + 1} of {pages.length}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === pages.length - 1} className={`text-pink-700 text-xl bg-transparent border-none ${page === pages.length - 1 ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>Next &gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterDisplay;
