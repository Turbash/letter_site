

import { useState } from 'react';
import { geminiModel } from '../firebase';
import { useNavigate } from 'react-router-dom';
import LetterPage from './LetterPage';

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export default function LoveLetterGenerator() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const navigate = useNavigate();

  async function handleGenerateLetter(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedLetter('');
    try {
  const prompt = `You are an expert at writing deeply emotional, realistic, and human love letters. Write a love letter from ${from} to ${to} that is filled with genuine feeling and warmth. The user has provided this message as inspiration: "${message}". Do NOT include the message text itself in the letter. Instead, use the message to inspire the style, tone, and content of the letter. If the message suggests a particular style (e.g., playful, poetic, passionate, nostalgic), write the letter in that style. If no style is clear, write a poetic, lovely letter. Make the letter feel personal, authentic, and full of emotion. Do NOT include any salutation like 'Dear ...,' or closing like 'Yours, ...' -- only generate the body of the letter.`;
      const result = await geminiModel.generateContent(prompt);
      console.log('Gemini API result:', result);
      let text = result.response.candidates[0].content.parts[0].text.trim();
      if (!text) {
        setError('No letter generated (unexpected response format). See console for details.');
        setLoading(false);
        return;
      }
      setGeneratedLetter(text);
      setShowLetter(true);
    } catch (err) {
      setError('Failed to generate letter. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (showLetter && generatedLetter) {
    navigate('/letter', { state: { to, from, letter: generatedLetter } });
    return null;
  }

  return (
    <div className="container bg-white/95 border-2 border-[#e1b382] rounded-3xl shadow-2xl max-w-[400px] w-[94vw] my-3 mx-auto p-8 sm:p-6 flex flex-col items-center">
      <form id="letterForm" onSubmit={handleGenerateLetter} className="w-full">
        <h1 id="mainTitle" className="text-[#b05d5e] mb-6 tracking-wide font-pacifico text-center text-3xl sm:text-4xl" style={{ textShadow: '1px 1px 0 #fffbe7', fontFamily: 'Pacifico, cursive' }}>
          Love Letter Generator
        </h1>
        <label htmlFor="to" className="text-[#b05d5e] font-bold mb-2">To</label>
        <input
          type="text"
          id="to"
          name="to"
          placeholder="Their name"
          required
          value={to}
          onChange={e => setTo(e.target.value)}
          className="w-full p-2 mb-4 border border-[#e1b382] rounded-lg text-base bg-[#f5e6ca] text-[#b05d5e] font-indie box-border focus:outline-none focus:ring-2 focus:ring-pink-200"
          style={{ fontFamily: 'Indie Flower, cursive' }}
        />
        <label htmlFor="message" className="text-[#b05d5e] font-bold mb-2">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Your heartfelt message..."
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full p-2 mb-4 border border-[#e1b382] rounded-lg text-base bg-[#f5e6ca] text-[#b05d5e] font-indie box-border focus:outline-none focus:ring-2 focus:ring-pink-200"
          style={{ fontFamily: 'Indie Flower, cursive' }}
        />
        <label htmlFor="from" className="text-[#b05d5e] font-bold mb-2">From</label>
        <input
          type="text"
          id="from"
          name="from"
          placeholder="Your name"
          required
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="w-full p-2 mb-4 border border-[#e1b382] rounded-lg text-base bg-[#f5e6ca] text-[#b05d5e] font-indie box-border focus:outline-none focus:ring-2 focus:ring-pink-200"
          style={{ fontFamily: 'Indie Flower, cursive' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#b05d5e] text-white rounded-lg text-lg font-pacifico shadow-md transition-colors duration-200 hover:bg-[#7c3a3a] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          {loading ? 'Generating...' : 'Generate Letter'}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}
