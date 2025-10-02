
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Domain {
  name: string;
  specializations: string[];
  icon: string;
}

export interface Question {
  question: string;
}

export interface Answer {
  question: string;
  answer: string;
}

export interface Score {
  metric: string;
  score: number;
  feedback: string;
}

export interface AnalysisReportData {
  overallFeedback: string;
  scores: Score[];
  answers: Answer[];
}

export interface InterviewSession {
  id: string; // This will be the db-generated UUID
  date: string;
  domain: string;
  specialization: string;
  report: AnalysisReportData;
}