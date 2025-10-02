
import React from 'react';
import type { AnalysisReportData, Answer, Score } from '../../types';
import Card from '../ui/Card';

interface AnalysisReportProps {
  report: AnalysisReportData;
}

const ScoreBar: React.FC<{ score: number, metric: string }> = ({ score, metric }) => (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-300">{metric}</span>
            <span className="text-sm font-medium text-yellow-400">{score} / 10</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-4 rounded-full" style={{ width: `${score * 10}%` }}></div>
        </div>
    </div>
);

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
        Interview Analysis Report
      </h1>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-3">Overall Feedback</h2>
        <p className="text-gray-300">{report.overallFeedback}</p>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Performance Scores</h2>
          <div className="space-y-6">
            {report.scores.map((s: Score) => (
                <div key={s.metric}>
                    <ScoreBar score={s.score} metric={s.metric} />
                    <p className="text-sm text-gray-400 mt-2">{s.feedback}</p>
                </div>
            ))}
          </div>
        </Card>
        
        <Card>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Q&A Review</h2>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {report.answers.map((qa: Answer, index: number) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                    <p className="font-semibold text-cyan-400">Q: {qa.question}</p>
                    <p className="text-gray-300 mt-1">A: {qa.answer || "No answer provided."}</p>
                </div>
            ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisReport;
