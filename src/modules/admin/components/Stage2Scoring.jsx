import React from 'react';

export default function Stage2Scoring({ candidate }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">Stage 2 – Deep Profile Analysis</h3>
      <ul className="space-y-1">
        <li><strong>Psychometric Compatibility:</strong> {candidate.psychometricScore}</li>
        <li><strong>Social Graph Influence:</strong> {candidate.socialGraph}</li>
        <li><strong>Reputation Scan:</strong> {candidate.reputation}</li>
        <li><strong>Fidelity Index:</strong> {candidate.fidelityIndex}</li>
      </ul>
    </div>
  );
}
