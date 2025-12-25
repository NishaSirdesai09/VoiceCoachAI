import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getDB } from '../db/database.js';
import { generateFeedback } from '../services/gemini.js';

const router = express.Router();

// Generate AI feedback
router.post('/generate/:sessionId', authenticateToken, async (req, res) => {
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

    if (!session.transcript) {
      return res.status(400).json({ error: 'Session must be transcribed first' });
    }

    // Generate feedback using Gemini
    const feedback = await generateFeedback(session.transcript);

    // Store feedback
    const result = db.prepare(`
      INSERT INTO analysis_feedback (session_id, feedback_json)
      VALUES (?, ?)
    `).run(sessionId, JSON.stringify(feedback));

    res.json({
      feedbackId: result.lastInsertRowid,
      feedback,
      sessionId: parseInt(sessionId)
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Get feedback for session
router.get('/feedback/:sessionId', authenticateToken, (req, res) => {
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

    const feedback = db.prepare(`
      SELECT * FROM analysis_feedback
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(sessionId);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({
      feedback: JSON.parse(feedback.feedback_json),
      createdAt: feedback.created_at
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;

