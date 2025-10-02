
import React, { useState } from 'react';
import { INTERVIEW_DOMAINS } from '../../constants';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface DomainSelectorProps {
  onSelect: (domain: string, specialization: string) => void;
}

const DomainSelector: React.FC<DomainSelectorProps> = ({ onSelect }) => {
  const [selectedDomain, setSelectedDomain] = useState(INTERVIEW_DOMAINS[0]);
  const [selectedSpec, setSelectedSpec] = useState(selectedDomain.specializations[0]);

  const handleDomainChange = (domainName: string) => {
    const domain = INTERVIEW_DOMAINS.find(d => d.name === domainName);
    if (domain) {
      setSelectedDomain(domain);
      setSelectedSpec(domain.specializations[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(selectedDomain.name, selectedSpec);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-2">Choose Your Interview Field</h1>
      <p className="text-gray-400 text-center mb-8">Select a domain and specialization to get started.</p>
      
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3 text-yellow-400">Domain</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INTERVIEW_DOMAINS.map((domain) => (
              <button
                key={domain.name}
                type="button"
                onClick={() => handleDomainChange(domain.name)}
                className={`p-4 rounded-lg text-center transition-all duration-300 ${
                  selectedDomain.name === domain.name 
                    ? 'bg-gradient-to-br from-purple-600 to-cyan-500 text-white ring-2 ring-yellow-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <i className={`fas ${domain.icon} text-3xl mb-2`}></i>
                <span className="block font-semibold">{domain.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="specialization" className="block text-lg font-semibold mb-3 text-yellow-400">Specialization</label>
          <select
            id="specialization"
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {selectedDomain.specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <Button type="submit" variant="primary" className="w-full md:w-auto text-lg">
            Start Interview <i className="fas fa-play ml-2"></i>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DomainSelector;
