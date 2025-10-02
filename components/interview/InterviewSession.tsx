import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import type { Answer } from '../../types';
import { getInterviewHint } from '../../services/aiService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface InterviewSessionProps {
  questions: string[];
  onFinish: (answers: Answer[]) => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ questions, onFinish }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isSupported: isSpeechSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({ lang: 'en-US', interimResults: true, continuous: true, autoStopSilenceMs: 3000 });

  useEffect(() => {
    const questionText = questions[currentQIndex];

    // Reset hint when question changes
    setHint(null); 

    // Prefill answer if user navigates back
    const existingAnswer = answers.find(a => a.question === questionText);
    setCurrentAnswer(existingAnswer ? existingAnswer.answer : '');
    textAreaRef.current?.focus();
  }, [currentQIndex, questions, answers]);

  // Merge speech transcript into current answer as it comes in
  useEffect(() => {
    if (!isSpeechSupported) return;
    if (!isListening && !transcript && !interimTranscript) return;
    const combined = [currentAnswer, transcript, interimTranscript].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
    setCurrentAnswer(combined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, interimTranscript]);

  const handleNext = () => {
    const newAnswer: Answer = { question: questions[currentQIndex], answer: currentAnswer };

    const finalAnswers = [...answers];
    const existingAnswerIndex = finalAnswers.findIndex(a => a.question === newAnswer.question);

    if (existingAnswerIndex > -1) {
      finalAnswers[existingAnswerIndex] = newAnswer;
    } else {
      finalAnswers.push(newAnswer);
    }
    setAnswers(finalAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      onFinish(finalAnswers);
    }
  };
  
  const handleGetHint = async () => {
    setIsHintLoading(true);
    setHint(null);
    const generatedHint = await getInterviewHint(questions[currentQIndex]);
    setHint(generatedHint);
    setIsHintLoading(false);
  };

  const handleToggleMic = () => {
    if (!isSpeechSupported) return;
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const progressPercentage = ((currentQIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <p className="text-sm text-yellow-400">Question {currentQIndex + 1} of {questions.length}</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="p-8 bg-gray-800 rounded-lg shadow-2xl mb-2 relative">
        <h2 className="text-3xl font-semibold leading-relaxed">{questions[currentQIndex]}</h2>
      </div>
      
      <div className="h-16 mb-2 flex items-center justify-start">
        {hint && (
          <div className="p-3 bg-gray-700/50 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm animate-fade-in">
            <i className="fas fa-lightbulb mr-2"></i><strong>Hint:</strong> {hint}
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={textAreaRef}
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here."
          className="w-full h-48 p-4 bg-gray-700 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
        <div className="absolute right-3 -top-12 flex items-center gap-3">
          <Button
            onClick={handleToggleMic}
            variant={isListening ? 'secondary' : 'ghost'}
            className={isListening ? 'from-red-600 to-red-400' : ''}
            disabled={!isSpeechSupported}
          >
            {isListening ? (
              <>
                <i className="fas fa-microphone-slash mr-2"></i> Stop
              </>
            ) : (
              <>
                <i className="fas fa-microphone mr-2"></i> Speak
              </>
            )}
          </Button>
          {!isSpeechSupported && (
            <span className="text-xs text-gray-400">Speech recognition not supported</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setCurrentQIndex(currentQIndex - 1)}
            disabled={currentQIndex === 0}
            variant="ghost"
          >
            Previous
          </Button>
          <Button
            onClick={handleGetHint}
            isLoading={isHintLoading}
            variant="secondary"
            className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
            <i className="fas fa-lightbulb mr-2"></i> Get a Hint
          </Button>
        </div>
        <Button onClick={handleNext} variant="primary">
          {currentQIndex === questions.length - 1 ? 'Finish & Analyze' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default InterviewSession;