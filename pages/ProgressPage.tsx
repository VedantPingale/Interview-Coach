
import React, { useState, useEffect } from 'react';
import { InterviewSession } from '../types';
import ProgressChart from '../components/progress/ProgressChart';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { supabase } from '../services/supabaseService';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const ProgressPage: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSessions = async () => {
        setIsLoading(true);
        try {
          const userSessions = await supabase.getSessions();
          setSessions(userSessions);
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSessions();
    } else {
      setIsLoading(false);
      setSessions([]);
    }
  }, [isAuthenticated]);

  const getOverallScore = (report: InterviewSession['report']) => {
    if (!report.scores || report.scores.length === 0) return 0;
    const total = report.scores.reduce((acc, s) => acc + s.score, 0);
    return parseFloat((total / report.scores.length).toFixed(1));
  };

  if (isLoading) {
    return <Spinner message="Loading your progress..." />;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-lock text-6xl text-gray-600 mb-4"></i>
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">Please log in to view your progress.</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-chart-line text-6xl text-gray-600 mb-4"></i>
        <h1 className="text-4xl font-bold mb-2">No Progress Yet</h1>
        <p className="text-gray-400">
          <Link to="/interviews" className="text-yellow-400 hover:underline">Complete an interview session</Link> to see your progress here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">Your Progress</h1>
      
      <div className="mb-12">
        <Card>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Overall Performance Trend</h2>
          <ProgressChart data={sessions} />
        </Card>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Session History</h2>
        <div className="space-y-4">
          {sessions.map(session => (
            <Card key={session.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-cyan-400">{session.specialization}</p>
                  <p className="text-sm text-gray-400">{session.domain} - {session.date}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-400">{getOverallScore(session.report)}</p>
                    <p className="text-sm text-gray-500">Avg Score</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
