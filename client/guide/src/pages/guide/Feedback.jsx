import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Send, Search, Filter, Star, Clock, User } from 'lucide-react';

export default function Feedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 'f1',
      studentName: 'Ananya Sharma',
      groupName: 'Alpha Team',
      project: 'E-commerce Platform',
      feedback: 'Excellent work on the authentication module. The implementation is clean and follows best practices.',
      rating: 5,
      status: 'Submitted',
      date: '2024-01-20',
      response: 'Thank you for the feedback! We will work on improving the UI components.'
    },
    {
      id: 'f2',
      studentName: 'Rahul Verma',
      groupName: 'Beta Squad',
      project: 'Real-time Chat App',
      feedback: 'Good progress on the backend. Consider improving error handling and user validation.',
      rating: 4,
      status: 'Pending Response',
      date: '2024-01-19',
      response: null
    },
    {
      id: 'f3',
      studentName: 'Neha Singh',
      groupName: 'Project Phoenix',
      project: 'AI Recommendation System',
      feedback: 'Outstanding work! The algorithm implementation is innovative and well-documented.',
      rating: 5,
      status: 'Completed',
      date: '2024-01-18',
      response: 'We appreciate your guidance throughout the project!'
    }
  ]);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  const [newFeedback, setNewFeedback] = useState({
    studentName: '',
    groupName: '',
    project: '',
    feedback: '',
    rating: 5,
    recommendations: ''
  });

  const availableStudents = [
    { name: 'Ananya Sharma', group: 'Alpha Team', project: 'E-commerce Platform' },
    { name: 'Rahul Verma', group: 'Beta Squad', project: 'Real-time Chat App' },
    { name: 'Neha Singh', group: 'Project Phoenix', project: 'AI Recommendation System' },
    { name: 'Vikram Rao', group: 'Quantum Coders', project: 'Online Learning System' },
    { name: 'Priya Patel', group: 'Innovation Hub', project: 'Smart City Dashboard' }
  ];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || feedback.status === filterStatus;
    const matchesRating = filterRating === 'All' || feedback.rating === parseInt(filterRating);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const submitFeedback = () => {
    if (newFeedback.studentName && newFeedback.feedback) {
      const feedback = {
        id: `f${Date.now()}`,
        ...newFeedback,
        status: 'Submitted',
        date: new Date().toISOString().split('T')[0],
        response: null
      };
      setFeedbacks([...feedbacks, feedback]);
      setNewFeedback({
        studentName: '',
        groupName: '',
        project: '',
        feedback: '',
        rating: 5,
        recommendations: ''
      });
      setShowFeedbackModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500/30 text-blue-300';
      case 'Pending Response': return 'bg-orange-500/30 text-orange-300';
      case 'Completed': return 'bg-green-500/30 text-green-300';
      default: return 'bg-gray-500/30 text-gray-300';
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {/* Header */}
      <div className="sticky top-0 w-full bg-white/20 backdrop-blur-md border-b border-white/30 shadow-glow z-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/guide/dashboard')}
            className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition border border-white/30"
          >
            <ChevronLeft size={18} className="mr-2" /> Back to Dashboard
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
            Student <span className="text-teal-400">Feedback</span>
          </h1>

          <div className="flex gap-2">
            <Link to="/guide/students" className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">Students</Link>
            <Link to="/guide/profile" className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">Profile</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Feedback Management</h2>
            <p className="text-white/70">Provide feedback and track student responses</p>
          </div>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            <MessageSquare size={20} className="mr-2" />
            Give Feedback
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2 flex items-center bg-white/10 rounded-xl border border-white/20 px-3">
              <Search size={18} className="text-white/80 mr-2" />
              <input
                className="w-full bg-transparent text-white py-2 outline-none"
                placeholder="Search students, groups, or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="bg-white/10 text-white rounded-xl border border-white/20 px-3 py-2 appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All" className="bg-gray-800 text-white">All Status</option>
              <option value="Submitted" className="bg-gray-800 text-white">Submitted</option>
              <option value="Pending Response" className="bg-gray-800 text-white">Pending Response</option>
              <option value="Completed" className="bg-gray-800 text-white">Completed</option>
            </select>
            <select
              className="bg-white/10 text-white rounded-xl border border-white/20 px-3 py-2 appearance-none"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="All" className="bg-gray-800 text-white">All Ratings</option>
              <option value="5" className="bg-gray-800 text-white">5 Stars</option>
              <option value="4" className="bg-gray-800 text-white">4 Stars</option>
              <option value="3" className="bg-gray-800 text-white">3 Stars</option>
              <option value="2" className="bg-gray-800 text-white">2 Stars</option>
              <option value="1" className="bg-gray-800 text-white">1 Star</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{feedback.studentName}</h3>
                    <p className="text-white/70 text-sm">{feedback.groupName} • {feedback.project}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    {getRatingStars(feedback.rating)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-white/80 text-sm leading-relaxed">{feedback.feedback}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <span>Given on: {feedback.date}</span>
                <span>ID: {feedback.id}</span>
              </div>
              
              {feedback.response && (
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 mb-4">
                  <p className="text-white/70 text-sm mb-2">Student Response:</p>
                  <p className="text-white/80 text-sm">{feedback.response}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedStudent(feedback);
                    setNewFeedback({
                      studentName: feedback.studentName,
                      groupName: feedback.groupName,
                      project: feedback.project,
                      feedback: feedback.feedback,
                      rating: feedback.rating,
                      recommendations: ''
                    });
                    setShowFeedbackModal(true);
                  }}
                  className="bg-teal-500/30 text-teal-300 py-2 px-4 rounded-lg border border-teal-400/30 hover:bg-teal-500/40 transition"
                >
                  Edit Feedback
                </button>
                {!feedback.response && (
                  <button className="bg-orange-500/30 text-orange-300 py-2 px-4 rounded-lg border border-orange-400/30 hover:bg-orange-500/40 transition">
                    Remind Student
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={64} className="text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No feedback found</h3>
            <p className="text-white/60">Start providing feedback to help students improve</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedStudent ? 'Edit Feedback' : 'Give New Feedback'}
              </h2>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedStudent(null);
                  setNewFeedback({
                    studentName: '',
                    groupName: '',
                    project: '',
                    feedback: '',
                    rating: 5,
                    recommendations: ''
                  });
                }}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Student</label>
                <select
                  value={newFeedback.studentName}
                  onChange={(e) => {
                    const student = availableStudents.find(s => s.name === e.target.value);
                    setNewFeedback(prev => ({
                      ...prev,
                      studentName: e.target.value,
                      groupName: student ? student.group : '',
                      project: student ? student.project : ''
                    }));
                  }}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="" className="bg-gray-800 text-white">Select student</option>
                  {availableStudents.map(student => (
                    <option key={student.name} value={student.name} className="bg-gray-800 text-white">
                      {student.name} - {student.group}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">Group</label>
                  <input
                    type="text"
                    value={newFeedback.groupName}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, groupName: e.target.value }))}
                    placeholder="Group name"
                    className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">Project</label>
                  <input
                    type="text"
                    value={newFeedback.project}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, project: e.target.value }))}
                    placeholder="Project title"
                    className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewFeedback(prev => ({ ...prev, rating }))}
                      className={`p-2 rounded-lg transition ${
                        newFeedback.rating >= rating
                          ? 'bg-yellow-500/30 text-yellow-400'
                          : 'bg-white/10 text-white/50 hover:text-white/70'
                      }`}
                    >
                      <Star size={20} className={newFeedback.rating >= rating ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Feedback</label>
                <textarea
                  value={newFeedback.feedback}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Provide detailed feedback..."
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows="4"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Recommendations</label>
                <textarea
                  value={newFeedback.recommendations}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, recommendations: e.target.value }))}
                  placeholder="Suggest improvements..."
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitFeedback}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition flex-1"
              >
                {selectedStudent ? 'Update Feedback' : 'Submit Feedback'}
              </button>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedStudent(null);
                  setNewFeedback({
                    studentName: '',
                    groupName: '',
                    project: '',
                    feedback: '',
                    rating: 5,
                    recommendations: ''
                  });
                }}
                className="bg-white/10 text-white py-3 px-6 rounded-lg border border-white/30 hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



