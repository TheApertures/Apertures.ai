import React from "react";
import SplashScreen from "../../components/SplashScreen";

export default function ObserverPortal() {
  return (
    <div>
      <SplashScreen />
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome, Observer</h1>
        <p className="mb-4">Experience the world of Ethan Carter through cinematic immersion.</p>
        <div className="rounded-xl border p-4 shadow-lg">[Scene Loader Placeholder]</div>
      </div>
    </div>
  );
}
