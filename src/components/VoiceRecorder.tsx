import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Send, Clock } from 'lucide-react';

interface VoiceRecorderProps {
  onSubmit?: (audioBlob: Blob) => void;
  timeLimit?: number;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSubmit, timeLimit = 60 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const uploadRetryCountRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const isTypeSupported = MediaRecorder.isTypeSupported(options.mimeType);
      const mediaRecorder = isTypeSupported
        ? new MediaRecorder(stream, options)
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setHasRecording(true);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // request data every 1s
      setIsRecording(true);
      setTimeLeft(timeLimit);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Microphone access error:', error);
      setUploadError('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setHasRecording(false);
    setAudioBlob(null);
    setTimeLeft(timeLimit);
    setUploadError(null);
    setUploadSuccess(false);
    uploadRetryCountRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Improved submitRecording with retries and no alert()
  const submitRecording = async () => {
    if (!audioBlob || uploading) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'memory-verse.webm');
    formData.append('greeting', 'Brother Adeyemi');
    formData.append('type', 'memory_verse');

    const maxRetries = 3;

    const attemptUpload = async (): Promise<boolean> => {
      try {
        const response = await fetch('https://server-wizg.onrender.com/api/upload-recording', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json();
        console.log('Upload successful:', result.message);
        setUploadSuccess(true);
        return true;
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError((error as Error).message || 'Upload failed');
        return false;
      }
    };

    while (uploadRetryCountRef.current < maxRetries) {
      const success = await attemptUpload();
      if (success) break;
      uploadRetryCountRef.current += 1;
      // Wait 1s before retrying
      await new Promise((res) => setTimeout(res, 1000));
    }

    if (uploadRetryCountRef.current === maxRetries && !uploadSuccess) {
      console.error('Max upload retries reached. Upload failed.');
    }

    setUploading(false);

    if (onSubmit && audioBlob) {
      onSubmit(audioBlob);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && hasRecording && audioBlob && !uploading) {
      // Auto submit when time is up
      submitRecording();
    }
  }, [timeLeft, hasRecording, audioBlob]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <div
          className={`text-6xl font-bold ${
            timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-primary'
          }`}>
          <Clock className="w-8 h-8 inline-block mr-2" />
          {formatTime(timeLeft)}
        </div>

        <div className="space-y-4">
          {isRecording && (
            <div className="flex items-center justify-center space-x-2 text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording...</span>
            </div>
          )}

          {!hasRecording ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-medium transition-all duration-200 ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-primary hover:bg-orange-600'
              }`}
              disabled={uploading}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={playRecording}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-200"
                disabled={uploading || timeLeft === 0}
              >
                <Play className="w-6 h-6" />
              </button>

              <button
                onClick={deleteRecording}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200"
                disabled={uploading || timeLeft === 0}
              >
                <Trash2 className="w-6 h-6" />
              </button>

              <button
                onClick={submitRecording}
                className={`px-6 py-3 bg-orange-primary hover:bg-orange-600 text-white rounded-xl flex items-center space-x-2 transition-all duration-200 font-medium ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={uploading || timeLeft === 0}
              >
                <Send className="w-5 h-5" />
                <span>{uploading ? 'Uploading...' : 'Submit'}</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm">
          {!hasRecording
            ? 'Click the microphone to start recording your answer'
            : 'Play to review, delete to re-record, or submit your answer'}
        </p>

        {timeLeft === 0 && hasRecording && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-orange-700 font-medium">
              Time&apos;s up! Your recording will be submitted automatically.
            </p>
          </div>
        )}

        {/* {uploadError && (
          <div className="mt-4 text-red-600 font-medium">
            Failed to upload: {uploadError}. Retrying...
          </div>
        )} */}

        {uploadSuccess && (
          <div className="mt-4 text-green-600 font-medium">
            Upload successful!
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
