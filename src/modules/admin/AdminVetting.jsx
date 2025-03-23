import React from "react";
import Stage2Scoring from "./components/Stage2Scoring";

export default function AdminVetting() {
  const mockCandidate = {
    psychometricScore: "91%",
    socialGraph: "Global Tier A2",
    reputation: "Flawless",
    fidelityIndex: "96.7"
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Vetting – ByInvitationOnly.ai</h1>
      <div className="space-y-4">
        <div className="border rounded-lg p-4 shadow">[Stage 1: Initial Screening Placeholder]</div>
        <Stage2Scoring candidate={mockCandidate} />
        <div className="border rounded-lg p-4 shadow">[Stage 3: Human + AI Assessment Panel]</div>
        <div className="border rounded-lg p-4 shadow">[Stage 4: Invitation & Tier Assignment]</div>
      </div>
    </div>
  );
}
