import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Upload, TrendingUp, Mic, Sparkles } from 'lucide-react';

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to VoiceCoachAI
          </h1>
          <p className="text-white/90 text-lg">
            AI-powered voice coaching to boost your speaking skills
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Mic className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">45%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Engagement Boost</h3>
            <p className="text-white/70 text-sm">
              Students see improved engagement with AI-powered feedback
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Smart Analysis</h3>
            <p className="text-white/70 text-sm">
              Powered by Gemini multimodal LLM for comprehensive feedback
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">24/7</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Always Available</h3>
            <p className="text-white/70 text-sm">
              Practice and improve your voice skills anytime, anywhere
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Get Started</h2>
          <p className="text-white/80 mb-6">
            Upload an audio recording of your speech to receive instant AI-powered feedback
            on clarity, pace, intonation, and more.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Audio</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

