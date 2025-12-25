import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Upload as UploadIcon, FileAudio, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await axios.post('/api/audio/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { sessionId: id } = response.data;
      setSessionId(id);
      setUploading(false);
      setTranscribing(true);

      // Automatically start transcription
      await axios.post(`/api/audio/transcribe/${id}`);
      setTranscribing(false);

      // Navigate to analysis page
      navigate(`/analysis/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
      setUploading(false);
      setTranscribing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Upload Audio</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/50 transition">
              <input
                type="file"
                id="audio-upload"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="audio-upload" className="cursor-pointer">
                {file ? (
                  <div className="space-y-4">
                    <FileAudio className="h-16 w-16 text-white mx-auto" />
                    <div>
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-white/70 text-sm mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <UploadIcon className="h-16 w-16 text-white/70 mx-auto" />
                    <div>
                      <p className="text-white font-semibold">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-white/70 text-sm mt-1">
                        MP3, WAV, OGG, or WebM (max 50MB)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  {uploading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : transcribing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Transcribing with Whisper...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span>Ready to upload</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading || transcribing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : transcribing ? 'Processing...' : 'Upload & Analyze'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white/5 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-3">How it works:</h3>
            <ol className="space-y-2 text-white/80 text-sm">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Upload your audio recording (speech, presentation, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>AI transcribes your audio using OpenAI Whisper</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Gemini AI analyzes your speech and provides detailed feedback</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Review your scores and personalized recommendations</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
}

