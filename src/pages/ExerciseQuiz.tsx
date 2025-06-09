import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import VoiceRecorder from '../components/VoiceRecorder';
import { ArrowLeft, Dumbbell, Check, Shuffle } from 'lucide-react';

const ExerciseQuiz = () => {
  const { getGreeting } = useUser();
  const navigate = useNavigate();

  const [currentEra, setCurrentEra] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const eras = [
    "The Creation Era", "The Era of the Patriarchs", "Exodus Era", "The Conquest Era",
    "Judges Era", "The United Kingdom of Isreal Era", "The Divided Kingdom of Isreal Era",
    "Babylonian Captivity Era", "The Return Era", "Silent Era", "The Gospel Era",
    "The Era of the beginning of the church"
  ];

  const selectRandomEra = () => {
    const randomEra = eras[Math.floor(Math.random() * eras.length)];
    setCurrentEra(randomEra);
  };

  const handleSubmit = async (audioBlob: Blob) => {
    setUploading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const formData = new FormData();
      formData.append('audio', audioBlob, 'exercise-recording.webm');

      const fullGreeting = getGreeting(); // e.g., "Brother Adeyemi"
      const [title, ...rest] = fullGreeting.split(' ');
      const actualName = rest.join(' ') || 'Anonymous';

      formData.append('name', actualName);
      formData.append('gender', title === 'Brother' ? 'male' : 'female');
      formData.append('quizType', 'Exercise');
      formData.append('era', currentEra || 'Unknown Era');

      const response = await fetch('https://server-wizg.onrender.com/api/upload-recording', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload audio. Please try again.');
      }

      setShowThankYou(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const audioEl = audioRef.current;

    const updateTimeLeft = () => {
      if (!audioEl.duration || isNaN(audioEl.duration)) return;
      setTimeLeft(Math.max(0, Math.floor(audioEl.duration - audioEl.currentTime)));
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(Math.floor(audioEl.duration));
      setTimeLeft(Math.floor(audioEl.duration));
    };

    audioEl.addEventListener('timeupdate', updateTimeLeft);
    audioEl.addEventListener('ended', () => setTimeLeft(0));
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioEl.removeEventListener('timeupdate', updateTimeLeft);
      audioEl.removeEventListener('ended', () => setTimeLeft(0));
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioUrl]);

  const retry = () => {
    setCurrentEra(null);
    setShowThankYou(false);
    setError(null);
    setAudioUrl(null);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-cream">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full text-center border border-orange-100">
          <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you {getGreeting()} for taking the quiz. You will receive feedback shortly via Joseph Group.
            You may retry to test proficiency on another era.
          </p>
          <div className="space-y-3">
            <button onClick={retry} className="w-full bg-orange-primary hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200">
              Try Another Era
            </button>
            <button onClick={() => navigate('/quiz')} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200">
              Back to Quiz Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-cream">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/quiz')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Quiz Menu</span>
        </button>

        <div className="text-center mb-8">
          <div className="bg-cream rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-orange-primary">
            <Dumbbell className="w-10 h-10 text-orange-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Exercise Quiz</h1>
          <p className="text-gray-600 text-lg">
            Welcome {getGreeting()}! Test your knowledge of biblical eras.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        {!currentEra ? (
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-orange-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Generate Random Era</h3>
              <p className="text-gray-600 mb-8">
                Click the button below to randomly select a biblical era for your exercise.
              </p>
              <button
                onClick={selectRandomEra}
                className="bg-orange-primary hover:bg-orange-600 text-white py-4 px-8 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Shuffle className="w-6 h-6" />
                <span>Generate Random Era</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">
                Selected Era: {currentEra}
              </h3>
              <div className="bg-orange-100 border border-orange-300 rounded-xl p-6">
                <h4 className="font-bold text-orange-800 mb-3">Your Task:</h4>
                <ul className="text-orange-700 space-y-2">
                  <li>1. Describe this era based on what you remember.</li>
                  <li>2. Give three names in that era.</li>
                  <li>3. State the book(s) where the story is.</li>
                  <li>4. Keep it within 60 seconds.</li>
                </ul>
              </div>

              <VoiceRecorder
                timeLimit={60}
                uploading={uploading}
                onSubmit={(blob) => {
                  // Fix for mobile: wait a bit before uploading to ensure audio is fully recorded
                  setTimeout(() => handleSubmit(blob), 300);
                }}
              />

              {uploading && (
                <div className="text-center mt-6">
                  <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-orange-600 border-solid"></span>
                  <p className="text-orange-800 mt-2">Uploading, please wait...</p>
                </div>
              )}

              {audioUrl && (
                <div className="mt-6 text-center">
                  <audio ref={audioRef} controls src={audioUrl} className="mx-auto" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseQuiz;
