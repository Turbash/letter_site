

import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Vara from 'vara';
import ShareModal from './ShareModal';

const LetterDisplay = ({ to, from, letter, onEdit }) => {
  const varaRef = useRef(null);
  const varaInstance = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  function splitMessagePages(message, maxLen = 180) {
    if (!message) return [];
    const sentences = message.match(/[^.!?]+[.!?\n]+|[^.!?]+$/g) || [];
    const pages = [];
    let curr = '';
    for (const sentence of sentences) {
      if ((curr + sentence).length > maxLen && curr.length > 0) {
        pages.push(curr.trim());
        curr = '';
      }
      curr += sentence;
    }
    if (curr.length > 0) pages.push(curr.trim());
    if (pages.length === 0) pages.push('');
    if (pages.length > 0 && pages[pages.length - 1].length > maxLen * 0.7) {
      pages.push('');
    }
    return pages;
  }
  const pages = splitMessagePages(letter);

  useEffect(() => {
    if (!varaRef.current) return;
    if (varaInstance.current) varaInstance.current.destroy && varaInstance.current.destroy();
    varaRef.current.innerHTML = '';
    setIsAnimating(true);
    let lines = [];
    let y = 40;
    let bodyDuration = 10800;
    let salutationDuration = 1800;
    let signatureDuration = 1800;
    let delayBetween = 400;
    if (page === 0 && to) {
      lines.push({
        text: `Dear ${to},`,
        fontSize: 32,
        color: '#be185d',
        y,
        id: 'salutation',
        duration: salutationDuration,
        delay: 0,
      });
      y += 28;
    }
    if (pages[page]) {
      lines.push({
        text: pages[page],
        fontSize: 26,
        color: '#2d1a0d',
        y,
        id: 'body',
        duration: bodyDuration,
        delay: (page === 0 && to) ? delayBetween : 0,
      });
      y += 80;
    }
    if (page === pages.length - 1 && from) {
      lines.push({
        text: `Yours, ${from}`,
        fontSize: 28,
        color: '#be185d',
        y,
        id: 'signature',
        duration: signatureDuration,
        delay: delayBetween,
      });
    }
    try {
      varaInstance.current = new Vara(
        '#vara-container',
        'https://cdn.jsdelivr.net/npm/vara@1.4.0/fonts/Satisfy/SatisfySL.json',
        lines,
        {
          strokeWidth: 2.2,
          color: '#2d1a0d',
          duration: 1800, 
          textAlign: 'center',
          fontSize: 28,
          width: 380,
          height: 260,
          queued: true,
          fontWeight: 'normal',
          letterSpacing: 0,
          showButton: false,
          autoAnimation: true,
          onEnd: () => {
            setIsAnimating(false);
            setTimeout(() => {
              if (page < pages.length - 1) {
                setPage(page + 1);
              }
            }, 900);
          },
          container: varaRef.current,
        }
      );
    } catch (e) {
      setIsAnimating(false);
    }
  }, [to, from, letter, page]);

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
      const url = `${window.location.origin}/letter/${docRef.id}`;
      if (navigator.share) {
        await navigator.share({ title: 'A Love Letter', text: 'Read this beautiful letter', url });
        setIsSharing(false);
      } else {
        setShareUrl(url);
        setIsSharing(false);
      }
    } catch (e) {
      setError('Failed to share. Try again.');
      setIsSharing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' && page < pages.length - 1) {
      setPage(page + 1);
    } else if (e.key === 'ArrowLeft' && page > 0) {
      setPage(page - 1);
    }
  };

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50 && page > 0) {
      setPage(page - 1);
    } else if (dx < -50 && page < pages.length - 1) {
      setPage(page + 1);
    }
    touchStartX.current = null;
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
            <div
              ref={varaRef}
              id="vara-container"
              className="w-full flex flex-col items-center justify-center min-h-[180px] px-4 sm:px-8"
              style={{ minHeight: '180px', width: '100%' }}
            />
          </div>
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
          <ShareModal shareUrl={shareUrl} onClose={() => setShareUrl(null)} />
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {pages.length > 1 && (
            <div className="flex justify-center items-center gap-6 mt-2 w-full">
              <button onClick={() => {
                if (varaInstance.current) varaInstance.current.destroy && varaInstance.current.destroy();
                if (page > 0) setPage(page - 1);
              }} disabled={page === 0} className={`text-pink-700 text-xl bg-transparent border-none ${page === 0 ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>&lt; Prev</button>
              <span className="text-pink-700 font-pacifico text-lg">Page {page + 1} of {pages.length}</span>
              <button onClick={() => {
                if (varaInstance.current) varaInstance.current.destroy && varaInstance.current.destroy();
                if (page < pages.length - 1) setPage(page + 1);
              }} disabled={page === pages.length - 1} className={`text-pink-700 text-xl bg-transparent border-none ${page === pages.length - 1 ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>Next &gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterDisplay;