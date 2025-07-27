import React, { useRef, useState } from "react";
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


function splitMessagePages(message, maxLen = 300) {
  if (!message) return [];
  const pages = [];
  let curr = '';
  for (const part of message.split(/(\s+)/)) {
    if ((curr + part).length > maxLen && curr.length > 0) {
      pages.push(curr);
      curr = '';
    }
    curr += part;
  }
  if (curr.length > 0) pages.push(curr);
  return pages;
}

const LetterDisplay = ({ to, from, letter, onEdit }) => {
  const [page, setPage] = useState(0);
  const [shareUrl, setShareUrl] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
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

  const handleShare = async () => {
    setIsSharing(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'letters'), {
        to,
        from,
        letter,
        created: serverTimestamp(),
      });
      const url = `${window.location.origin}/letter?id=${docRef.id}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `A love letter for ${to}`,
            text: `Read this beautiful letter!`,
            url,
          });
          setIsSharing(false);
          return;
        } catch (err) {
        }
      }
      setShareUrl(url);
    } catch (err) {
      setError('Failed to share. Please try again.');
    }
    setIsSharing(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-10 bg-transparent mobile-letter-bg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative flex items-center justify-center letter-content-wrapper"
        style={{ width: 'min(92vw, 420px)', aspectRatio: '9/16', maxHeight: '92vh' }}
      >
        <img
          src="/11488228.png"
          alt="Paper"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none desktop-only"
          draggable="false"
          style={{ zIndex: 0 }}
        />
        <div
          className="relative flex flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-8 text-[#2d1a0d] font-allura w-full h-full overflow-auto"
          style={{ fontFamily: 'Allura, cursive', zIndex: 1 }}
        >
          <div className="w-full flex flex-col justify-evenly items-center max-h-[70%]">
            <div className="text-pink-700 mb-3 text-left text-[1.3rem] sm:text-[1.7rem] w-full px-6 sm:px-12 break-words break-all overflow-hidden" style={{ wordBreak: 'break-word' }}>
              Dear {to},
            </div>
            <div
              className="whitespace-pre-line mb-2 flex-1 text-center break-words text-[1.1rem] sm:text-[1.4rem] leading-tight overflow-hidden break-all font-allura w-full px-6 sm:px-12"
              style={{ fontFamily: 'Allura, cursive', minHeight: '3em', wordBreak: 'break-word' }}
            >
              {pages[page]}
            </div>
            <div className="text-pink-700 mt-1 mb-2 text-right w-full text-[1.1rem] sm:text-[1.4rem] px-6 sm:px-12 break-words break-all overflow-hidden" style={{ wordBreak: 'break-word', marginTop: '0.5rem' }}>
              Yours, {from}
            </div>
          </div>
          {/* Action Buttons: Back & Share */}
          <div className="w-full flex flex-row justify-between items-center gap-4 mt-6 px-2 sm:px-6">
            <button
              onClick={onEdit}
              className="flex-1 bg-white text-pink-700 border border-yellow-300 rounded-lg px-4 py-2 font-pacifico shadow hover:bg-yellow-50 transition-all text-base"
            >
              Back
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 bg-pink-600 text-white rounded-lg px-4 py-2 font-pacifico shadow hover:bg-pink-700 transition-all text-base disabled:opacity-60"
            >
              {isSharing ? 'Sharing...' : 'Share'}
            </button>
          </div>
          {shareUrl && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
              <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
                <div className="mb-2 text-pink-700 font-pacifico text-lg">Share this letter!</div>
                <input
                  className="w-full border rounded px-2 py-1 mb-2 text-center"
                  value={shareUrl}
                  readOnly
                  onFocus={e => e.target.select()}
                />
                <div className="flex gap-3 mb-2">
                  <button
                    className="bg-green-500 text-white rounded px-3 py-1"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank')}
                  >WhatsApp</button>
                  <button
                    className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded px-3 py-1"
                    onClick={() => window.open(`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                  >Instagram</button>
                  <button
                    className="bg-blue-500 text-white rounded px-3 py-1"
                    onClick={() => {navigator.clipboard.writeText(shareUrl)}}
                  >Copy Link</button>
                </div>
                <button
                  className="text-pink-700 underline mt-1"
                  onClick={() => setShareUrl(null)}
                >Close</button>
              </div>
            </div>
          )}
          {error && <div className="text-red-600 mt-2">{error}</div>}
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
