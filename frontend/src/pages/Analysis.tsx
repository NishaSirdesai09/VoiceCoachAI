import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft, Sparkles, TrendingUp, Target, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Feedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedAnalysis: {
    clarity: number;
    pace: number;
    intonation: number;
    pronunciation: number;
    confidence: number;
  };
  recommendations: string[];
  summary: string;
}

export default function Analysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const [sessionRes, feedbackRes] = await Promise.all([
        axios.get(`/api/audio/sessions/${sessionId}`),
        axios.get(`/api/analysis/feedback/${sessionId}`).catch(() => null),
      ]);

      setSession(sessionRes.data.session);
      if (feedbackRes) {
        setFeedback(feedbackRes.data.feedback);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const generateFeedback = async () => {
    if (!session?.transcript) {
      setError('Session must be transcribed first');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await axios.post(`/api/analysis/generate/${sessionId}`);
      setFeedback(response.data.feedback);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate feedback');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center space-x-2 text-white/90 hover:text-white transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to History</span>
        </button>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analysis Results</h1>
              <p className="text-white/70">{session?.filename}</p>
            </div>
            {!feedback && (
              <button
                onClick={generateFeedback}
                disabled={generating || !session?.transcript}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>{generating ? 'Generating...' : 'Generate Feedback'}</span>
              </button>
            )}
          </div>

          {session?.transcript && (
            <div className="mb-8 bg-white/5 rounded-lg p-6">
              <h2 className="text-white font-semibold mb-3">Transcript</h2>
              <p className="text-white/80 text-sm leading-relaxed">{session.transcript}</p>
            </div>
          )}

          {feedback && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-semibold mb-2">Overall Score</h2>
                    <p className="text-white/70 text-sm">Based on comprehensive AI analysis</p>
                  </div>
                  <div className="text-6xl font-bold text-white">{feedback.overallScore}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, idx) => (
                      <li key={idx} className="text-white/80 text-sm flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-yellow-400" />
                    <span>Areas for Improvement</span>
                  </h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-white/80 text-sm flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>Detailed Analysis</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(feedback.detailedAnalysis).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">{value}/10</div>
                      <div className="text-white/70 text-xs capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Recommendations</h3>
                <ul className="space-y-3">
                  {feedback.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-white/80 text-sm flex items-start">
                      <span className="text-purple-400 mr-2 font-bold">{idx + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Summary</h3>
                <p className="text-white/80 text-sm leading-relaxed">{feedback.summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

