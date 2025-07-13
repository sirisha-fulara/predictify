import React from 'react';
import PredictionForm from './PredictionForm';
import PredictionHistory from './PredictionHistory';


export default function Dashboard() {
  return (
    <div className="p-6 " >

      <div className="grid md:grid-cols-1 gap-6 bg-gradient-to-b from-[#101212] relative to-[#08201D]">
        {/* 📤 Prediction Form */}
        <div className=" p-4 rounded-xl shadow">
          {/* <h2 className="text-xl font-semibold mb-2">Make a New Prediction</h2> */}
          <PredictionForm />
        </div>

        {/* 📄 History */}
        <div className=" p-4 rounded-xl shadow  bg-white">
          <PredictionHistory />
        </div>
      </div>
    </div>
  );
}
