import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LetterDisplay from './LetterDisplay';

export default function LetterPage() {
  const [searchParams] = useSearchParams();
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = searchParams.get('id');
  const location = useLocation();
  const navigate = useNavigate();

  const generatedLetter = location.state;

  useEffect(() => {
    async function fetchLetter() {
      if (!id) {
        setLoading(false);
        setLetterData(null);
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

  const displayData = id ? letterData : generatedLetter;
  if (!displayData) return <div className="text-center text-pink-700 font-pacifico mt-10">No letter to display.</div>;

  return (
    <LetterDisplay
      to={displayData.to}
      from={displayData.from}
      letter={displayData.letter}
      onEdit={() => navigate('/')}
    />
  );
}