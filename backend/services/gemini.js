import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      throw new Error('GEMINI_API_KEY is not configured. Please add your Gemini API key to the .env file.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateFeedback(transcript) {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert voice coach analyzing a student's speech transcript. Provide detailed, constructive feedback in the following JSON format:

{
  "overallScore": 85,
  "strengths": ["Clear articulation", "Good pacing"],
  "improvements": ["Work on pronunciation of technical terms", "Vary intonation more"],
  "detailedAnalysis": {
    "clarity": 8,
    "pace": 7,
    "intonation": 6,
    "pronunciation": 7,
    "confidence": 8
  },
  "recommendations": [
    "Practice reading aloud for 15 minutes daily",
    "Focus on varying pitch to maintain listener engagement",
    "Record yourself and listen back for self-assessment"
  ],
  "summary": "Overall good performance with room for improvement in intonation and technical pronunciation."
}

Transcript to analyze:
${transcript}

Provide your analysis in valid JSON format only, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    let feedback;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        feedback = JSON.parse(text);
      }
    } catch (parseError) {
      // Fallback if parsing fails
      feedback = {
        overallScore: 75,
        strengths: ["Good effort"],
        improvements: ["Continue practicing"],
        detailedAnalysis: {
          clarity: 7,
          pace: 7,
          intonation: 7,
          pronunciation: 7,
          confidence: 7
        },
        recommendations: ["Keep practicing regularly"],
        summary: text.substring(0, 200)
      };
    }

    return feedback;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Feedback generation failed: ${error.message}`);
  }
}

