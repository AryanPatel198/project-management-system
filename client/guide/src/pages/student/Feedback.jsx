// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAPI from '../../services/studentAPI';

function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await studentAPI.getFeedback();
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setFeedback(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 font-sans flex items-center justify-center">
        <div className="text-white text-lg">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center md:text-left">Feedback</h1>
        <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 shadow-lg">
          <p className="text-white text-lg mb-6 text-center md:text-left">
            View feedback from your guide here
          </p>
          <div className="space-y-6">
            {feedback ? (
              <div className="bg-white/5 p-4 md:p-6 rounded-xl border border-white/10">
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{feedback.project}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-accent-teal mb-2">Guide's Feedback</h3>
                    <p className="text-white/90 bg-gray-800/50 p-3 rounded-lg">{feedback.guideFeedback}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-accent-teal mb-2">Guide's Response</h3>
                    <p className="text-white/90 bg-gray-800/50 p-3 rounded-lg">{feedback.guideResponse}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 p-4 md:p-6 rounded-xl border border-white/10 text-center">
                <p className="text-white/70">No feedback available at the moment.</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
