import axios from 'axios';
// GEMINI_API_KEY and GEMINI_MODEL are no longer needed here as they are handled by the backend proxy
import { GEMINI_API_ENDPOINT } from './aiConfig.js';

const generationConfig = {
  temperature: 0.2,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

export const judgeAnswer = async (question, standardAnswer, userAnswer) => {
  // The URL is now simply the proxy endpoint.
  const apiUrl = GEMINI_API_ENDPOINT;

  const prompt = `You are an expert Java technical interviewer. Your task is to evaluate a user's answer to a question. Based on the provided question, standard answer, and the user's answer, you must determine if the answer is correct, provide concise feedback, and give a score from 0 to the question's maximum possible score.

You MUST return your evaluation in a strict JSON format, without any markdown formatting or other text. The JSON object must contain these three fields:
- "isCorrect": boolean
- "feedback": string (your concise feedback)
- "score": number (a score from 0 to ${question.score})

Question: "${question.question}"
Standard Answer: "${question.answer}"
User's Answer: "${userAnswer}"
Maximum Score: ${question.score}
`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: generationConfig,
    safetySettings: safetySettings,
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.data.candidates && response.data.candidates.length > 0) {
      let responseText = response.data.candidates[0].content.parts[0].text;
      
      // Add robust cleaning for the JSON string
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
      } else {
         // Fallback for cases where there are no backticks but might have other text
         const firstBrace = responseText.indexOf('{');
         const lastBrace = responseText.lastIndexOf('}');
         if (firstBrace !== -1 && lastBrace !== -1) {
           responseText = responseText.substring(firstBrace, lastBrace + 1);
         }
      }

      try {
        const result = JSON.parse(responseText);
        return result;
      } catch (jsonError) {
        console.error('Failed to parse JSON from AI response:', responseText, jsonError);
        return { isCorrect: false, feedback: `AI评分失败: 响应格式错误 (${jsonError.message})`, score: 0 };
      }
    } else {
      console.error('API Error: No candidates returned.', response.data);
      return { isCorrect: false, feedback: 'AI 未返回有效评分。', score: 0 };
    }
  } catch (error) {
    console.error('Error calling AI API:', error.response ? error.response.data : error.message);
    let feedback = 'AI 评分失败，请稍后重试。';
    if (error.response) {
      // Google API errors are often in error.response.data.error.message
      feedback = `AI 评分失败 (HTTP ${error.response.status}): ${error.response.data?.error?.message || '未知错误'}`;
    } else if (error.request) {
      feedback = 'AI 评分失败: 未收到服务器响应，请检查网络或代理地址。';
    } else {
      feedback = `AI 评分失败: ${error.message}`;
    }
    return {
      isCorrect: false,
      feedback: feedback,
      score: 0,
    };
  }
};
