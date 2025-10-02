import React from 'react';
import Card from '../components/ui/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-gray-300">
      <h1 className="text-5xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">
        About AI Interview Coach
      </h1>
      <p className="text-lg text-center mb-16">
        This application is a powerful, locally-run AI interview coaching platform. It's designed to help users practice for interviews without concerns about privacy or ongoing costs, by leveraging local AI models for all core functionalities.
      </p>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
          <div className="flex-1">
            <div className="p-6 border-2 border-dashed border-cyan-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-cyan-500">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Your Field</h3>
            <p className="text-gray-400">Choose from a wide range of domains and specializations to tailor the interview to your specific career path.</p>
          </div>
          <div className="text-2xl text-gray-600 hidden md:block">&rarr;</div>
          <div className="flex-1">
            <div className="p-6 border-2 border-dashed border-yellow-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-yellow-400">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Practice & Record</h3>
            <p className="text-gray-400">Answer 10 dynamically generated questions by typing or using your voice. Take your time and give it your best shot.</p>
          </div>
          <div className="text-2xl text-gray-600 hidden md:block">&rarr;</div>
          <div className="flex-1">
            <div className="p-6 border-2 border-dashed border-purple-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-purple-500">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get AI Analysis</h3>
            <p className="text-gray-400">Receive an instant, detailed report on your performance, including scores and constructive feedback.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <h2 className="text-2xl font-bold text-yellow-400 mb-3"><i className="fas fa-bullseye mr-2"></i> Our Mission</h2>
          <p className="text-gray-400">
            To provide a free, private, and effective tool for interview preparation. We believe everyone should have access to high-quality coaching to help them achieve their career goals.
          </p>
        </Card>
        <Card>
          <h2 className="text-2xl font-bold text-yellow-400 mb-3"><i className="fas fa-cogs mr-2"></i> Technology Stack</h2>
          <ul className="text-gray-400 list-disc list-inside space-y-2">
            <li><strong>Frontend:</strong> React & TypeScript with Tailwind CSS</li>
            <li><strong>AI Models:</strong> Ollama with local models (e.g., Llama 3)</li>
            <li><strong>Charts:</strong> Recharts</li>
            <li><strong>State Management:</strong> React Context & Hooks</li>
            <li><strong>Icons:</strong> Font Awesome</li>
          </ul>
        </Card>
      </div>
      
      <Card>
          <h2 className="text-2xl font-bold text-yellow-400 mb-3"><i className="fas fa-shield-alt mr-2"></i> Private & Local First</h2>
          <p className="text-gray-400">
            This tool is built on the principle of privacy. By integrating with local AI models via Ollama, we ensure that your interview data never leaves your computer. This provides complete privacy, offline functionality, and zero ongoing costs. You are in full control.
          </p>
        </Card>

       <div className="text-center mt-16">
        <p className="text-gray-500">Developed with passion by a world-class engineering team.</p>
       </div>
    </div>
  );
};

export default AboutPage;