import React from "react";

export default function MemberDashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Aperture Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white shadow p-4">[AgentOBO.ai Health + Strategy]</div>
        <div className="rounded-xl bg-white shadow p-4">[Legacy Codex & Forecasting]</div>
        <div className="rounded-xl bg-white shadow p-4">[Time Wealth + Travel Sync]</div>
        <div className="rounded-xl bg-white shadow p-4">[Dossier Snapshot]</div>
      </div>
    </div>
  );
}
