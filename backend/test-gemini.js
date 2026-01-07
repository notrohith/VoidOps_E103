import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

async function test() {
  try {
    console.log('Testing Gemini Flash 2.5...');
    const result = await model.generateContent('Say hello in a friendly way');
    const response = await result.response;
    console.log('Success! Response:', response.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();