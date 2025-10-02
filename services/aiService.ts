import { Answer } from '../types';
import { METRIC_NAMES } from '../constants';

const API_BASE_URL = 'http://localhost:3001/api';

const postRequest = async (endpoint: string, body: object) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw error;
    }
};

export const generateInterviewQuestions = async (domain: string, specialization: string): Promise<string[]> => {
  try {
    const data = await postRequest('/questions', { domain, specialization });
    if (data.questions && Array.isArray(data.questions)) {
      return data.questions;
    }
    throw new Error("Invalid format for questions received from local server.");
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return Array.from({ length: 10 }, (_, i) => `This is mock question ${i + 1} for ${specialization}. The local AI server is not running or has failed. Please start the server and try again.`);
  }
};

export const analyzeInterviewAnswers = async (answers: Answer[]) => {
  try {
    const report = await postRequest('/analyze', { answers });
    return report;
  } catch (error) {
    console.error("Error analyzing interview answers:", error);
    return {
      overallFeedback: "This is mock feedback because the local AI server is not running or has failed. Please start the server and try again.",
      scores: METRIC_NAMES.map(metric => ({
        metric,
        score: 0,
        feedback: `Mock feedback for ${metric.toLowerCase()}.`
      }))
    };
  }
};

export const getInterviewHint = async (question: string): Promise<string> => {
  try {
    const data = await postRequest('/hint', { question });
    return data.hint || 'Could not retrieve a hint from the local server.';
  } catch (error) {
    console.error("Error getting interview hint:", error);
    return "Failed to get a hint from the AI. Please ensure the local server is running.";
  }
};
