
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { InterviewSession } from '../../types';
import { INTERVIEW_METRICS } from '../../constants';

interface ProgressChartProps {
  data: InterviewSession[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const getOverallScore = (report: InterviewSession['report']) => {
    if (!report.scores || report.scores.length === 0) return 0;
    const total = report.scores.reduce((acc, s) => acc + s.score, 0);
    return parseFloat((total / report.scores.length).toFixed(1));
  };
  
  // Get unique metrics from all sessions to avoid duplicates
  const allMetrics = new Set<string>();
  data.forEach(session => {
    session.report.scores.forEach(score => {
      allMetrics.add(score.metric);
    });
  });
  const uniqueMetrics = Array.from(allMetrics);
  
  const chartData = data.map((session, index) => {
    const sessionData: any = {
      name: `Session ${index + 1}`,
      date: session.date,
      specialization: session.specialization,
    };
    
    // Add scores for each unique metric
    uniqueMetrics.forEach(metric => {
      const score = session.report.scores.find(s => s.metric === metric);
      sessionData[metric] = score ? score.score : null;
    });
    
    // Add Overall Score last so it appears last in legend
    sessionData['Overall Score'] = getOverallScore(session.report);
    
    return sessionData;
  });

  const getMetricColor = (metricName: string) => {
    const metric = INTERVIEW_METRICS.find(m => m.name === metricName);
    return metric ? metric.color : '#8884d8';
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" />
          <YAxis domain={[0, 10]} stroke="#A0AEC0" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
            labelStyle={{ color: '#F7B500' }}
          />
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
          {uniqueMetrics.map((metric) => (
             <Line key={metric} type="monotone" dataKey={metric} stroke={getMetricColor(metric)} strokeDasharray="5 5" />
          ))}
          <Line type="monotone" dataKey="Overall Score" stroke="#F7B500" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
