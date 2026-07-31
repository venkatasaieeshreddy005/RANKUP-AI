import React from 'react';

function Interview({ interviewData, onFinish }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Interview Session</h2>
        
        <p className="text-gray-600 mb-6">
          Role: <span className="font-semibold">{interviewData?.role || 'General'}</span>
        </p>

        <button
          onClick={() => onFinish({ score: 90, feedback: "Great performance!" })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Finish Interview
        </button>
      </div>
    </div>
  );
}

export default Interview;