import { useState } from 'react';
import { geminiModel, storage } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export default function LoveLetterGenerator() {
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState('romantic');
  const [details, setDetails] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleGenerateLetter = async () => {
    setLoading(true);
    setGeneratedLetter('');
    setError('');
    setDownloadUrl('');
    const prompt = `Write a heartfelt love letter to ${recipient}. The tone should be ${tone}. Include these specific details or memories: "${details}". Make it sound sincere, personal, and deeply emotional.`;
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setGeneratedLetter(text);
    } catch (err) {
      console.error("Error generating love letter:", err);
      setError("Failed to generate letter. Please try again. Check Firebase Console for AI Logic usage/errors.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLetter = async () => {
    if (!generatedLetter) return;
    setLoading(true);
    setError('');
    try {
      const letterRef = ref(storage, `letters/${Date.now()}.txt`);
      await uploadString(letterRef, generatedLetter, 'raw');
      const url = await getDownloadURL(letterRef);
      setDownloadUrl(url);
    } catch (err) {
      setError('Failed to save letter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-pacifico text-pink-700 mb-2">AI Love Letter Generator</h2>
      <input
        className="border p-2 rounded mb-2"
        placeholder="Recipient's Name"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <input
        className="border p-2 rounded mb-2"
        placeholder="Tone (e.g. romantic, playful)"
        value={tone}
        onChange={e => setTone(e.target.value)}
      />
      <textarea
        className="border p-2 rounded mb-2"
        placeholder="Details or memories to include"
        value={details}
        onChange={e => setDetails(e.target.value)}
      />
      <button
        className="bg-pink-600 text-white rounded px-4 py-2 font-pacifico disabled:opacity-50"
        onClick={handleGenerateLetter}
        disabled={loading || !recipient || !details}
      >
        {loading ? 'Generating...' : 'Generate Letter'}
      </button>
      {generatedLetter && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mt-2 font-allura whitespace-pre-line">
          {generatedLetter}
        </div>
      )}
      {generatedLetter && (
        <button
          className="bg-green-600 text-white rounded px-4 py-2 mt-2 font-pacifico"
          onClick={handleSaveLetter}
          disabled={loading}
        >
          Save & Share
        </button>
      )}
      {downloadUrl && (
        <div className="mt-2 text-green-700 break-all">
          Share this link: <a href={downloadUrl} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">{downloadUrl}</a>
        </div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
