import OpenAI from 'openai';
import { createReadStream } from 'fs';

let openai = null;

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      throw new Error('OPENAI_API_KEY is not configured. Please add your OpenAI API key to the .env file.');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

export async function transcribeAudio(filePath) {
  try {
    const client = getOpenAIClient();
    const transcription = await client.audio.transcriptions.create({
      file: createReadStream(filePath),
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });

    return transcription;
  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

