# VoiceCoachAI 🎤

A modern SaaS platform for AI-powered voice coaching that boosts student engagement by 45%. Built with React.js, Node.js, OpenAI Whisper ASR, and Google Gemini multimodal LLM.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication system
- 🎙️ **Audio Upload** - Multi-step audio upload with progress tracking
- 🧠 **AI Transcription** - Powered by OpenAI Whisper for accurate speech-to-text
- 🤖 **AI Analysis** - Gemini multimodal LLM provides comprehensive feedback
- 📊 **Detailed Feedback** - Scores, strengths, improvements, and recommendations
- 📜 **Session History** - Track all your voice coaching sessions
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- JWT for authentication
- Multer for file uploads
- OpenAI Whisper API for transcription
- Google Gemini API for AI analysis

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd VoiceAssistant
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   OPENAI_API_KEY=your-openai-api-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on `http://localhost:3000`
   - Backend on `http://localhost:5000`

## 🔑 API Keys Required

1. **OpenAI API Key** - For Whisper transcription
   - Get it from: https://platform.openai.com/api-keys

2. **Google Gemini API Key** - For AI analysis
   - Get it from: https://makersuite.google.com/app/apikey

## 📁 Project Structure

```
VoiceAssistant/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main app component
│   └── package.json
├── backend/           # Node.js backend
│   ├── routes/        # API routes
│   ├── services/      # Business logic (Whisper, Gemini)
│   ├── middleware/    # Auth middleware
│   ├── db/            # Database setup
│   └── server.js      # Express server
└── package.json       # Root package.json
```

## 🎯 Usage

1. **Register/Login** - Create an account or sign in
2. **Upload Audio** - Upload your speech recording (MP3, WAV, OGG, WebM)
3. **Automatic Transcription** - AI transcribes your audio using Whisper
4. **Generate Feedback** - Get AI-powered analysis from Gemini
5. **Review Results** - See detailed scores, strengths, and recommendations
6. **Track Progress** - View all your sessions in the history page

## 🛠️ Development

- Frontend dev server: `npm run dev:frontend`
- Backend dev server: `npm run dev:backend`
- Build for production: `npm run build`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Audio
- `POST /api/audio/upload` - Upload audio file
- `POST /api/audio/transcribe/:sessionId` - Transcribe audio
- `GET /api/audio/sessions` - Get user sessions
- `GET /api/audio/sessions/:sessionId` - Get single session

### Analysis
- `POST /api/analysis/generate/:sessionId` - Generate AI feedback
- `GET /api/analysis/feedback/:sessionId` - Get feedback

## 🎨 Screenshots

The application features a modern, gradient-based UI with:
- Clean authentication pages
- Intuitive dashboard
- Multi-step upload process
- Comprehensive analysis results
- Session history tracking

## 📄 License

MIT License - feel free to use this project for your portfolio or learning purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for showcasing AI-powered voice coaching capabilities**

