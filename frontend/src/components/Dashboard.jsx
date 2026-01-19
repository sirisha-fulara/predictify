import React from 'react';
import PredictionForm from './PredictionForm';
import PredictionHistory from './PredictionHistory';


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 pt-24">

      <div className="grid md:grid-cols-1 gap-8 max-w-7xl mx-auto">
        {/* 📤 Prediction Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {/* <h2 className="text-xl font-semibold mb-2 text-white">Make a New Prediction</h2> */}
          <PredictionForm />
        </div>

        {/* 📄 History */}
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          <PredictionHistory />
        </div>
      </div>
    </div>
  );
}
