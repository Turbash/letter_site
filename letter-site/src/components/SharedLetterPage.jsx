import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LetterDisplay from './LetterDisplay';

export default function SharedLetterPage() {
  const [searchParams] = useSearchParams();
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = searchParams.get('id');

  useEffect(() => {
    async function fetchLetter() {
      if (!id) {
        setError('No letter id provided.');
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'letters', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLetterData(docSnap.data());
        } else {
          setError('Letter not found.');
        }
      } catch (err) {
        setError('Failed to load letter.');
      }
      setLoading(false);
    }
    fetchLetter();
  }, [id]);

  if (loading) return <div className="text-center text-pink-700 font-pacifico mt-10">Loading letter...</div>;
  if (error) return <div className="text-center text-red-600 font-pacifico mt-10">{error}</div>;
  if (!letterData) return null;

  return (
    <LetterDisplay
      to={letterData.to}
      from={letterData.from}
      letter={letterData.letter}
      onEdit={() => window.location.href = '/'}
    />
  );
}