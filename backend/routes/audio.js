import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { authenticateToken } from '../middleware/auth.js';
import { getDB } from '../db/database.js';
import { transcribeAudio } from '../services/whisper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Upload audio
router.post('/upload', authenticateToken, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const db = getDB();
    const result = db.prepare(`
      INSERT INTO audio_sessions (user_id, filename, filepath, status)
      VALUES (?, ?, ?, 'uploaded')
    `).run(req.userId, req.file.originalname, req.file.path);

    res.status(201).json({
      sessionId: result.lastInsertRowid,
      filename: req.file.originalname,
      status: 'uploaded'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Transcribe audio
router.post('/transcribe/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const db = getDB();

    const session = db.prepare(`
      SELECT * FROM audio_sessions WHERE id = ? AND user_id = ?
    `).get(sessionId, req.userId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update status
    db.prepare('UPDATE audio_sessions SET status = ? WHERE id = ?')
      .run('transcribing', sessionId);

    // Transcribe using Whisper
    const transcript = await transcribeAudio(session.filepath);

    // Update session with transcript
    db.prepare('UPDATE audio_sessions SET transcript = ?, status = ? WHERE id = ?')
      .run(transcript, 'transcribed', sessionId);

    res.json({
      sessionId: parseInt(sessionId),
      transcript,
      status: 'transcribed'
    });
  } catch (error) {
    console.error('Transcribe error:', error);
    const db = getDB();
    db.prepare('UPDATE audio_sessions SET status = ? WHERE id = ?')
      .run('error', req.params.sessionId);
    res.status(500).json({ error: 'Transcription failed', details: error.message });
  }
});

// Get user sessions
router.get('/sessions', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const sessions = db.prepare(`
      SELECT id, filename, transcript, status, created_at
      FROM audio_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.userId);

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get single session
router.get('/sessions/:sessionId', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const db = getDB();
    
    const session = db.prepare(`
      SELECT * FROM audio_sessions
      WHERE id = ? AND user_id = ?
    `).get(sessionId, req.userId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

export default router;

