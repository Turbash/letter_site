import React from 'react';

export default function ShareModal({ shareUrl, onClose }) {
  if (!shareUrl) return null;
  return (
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
            onClick={() => { navigator.clipboard.writeText(shareUrl) }}
          >Copy Link</button>
        </div>
        <button
          className="text-pink-700 underline mt-1"
          onClick={onClose}
        >Close</button>
      </div>
    </div>
  );
}
