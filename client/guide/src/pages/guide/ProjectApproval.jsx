// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle, XCircle, Eye, Download, MessageSquare, Clock, AlertCircle, Check, X, Star } from 'lucide-react';

export default function ProjectApproval() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    technicalScore: 0,
    innovationScore: 0,
    presentationScore: 0,
    comments: '',
    suggestions: '',
    status: 'pending'
  });

  // Mock data for project proposals
  const [projects] = useState([
    {
      id: 'p1',
      groupName: 'Alpha Team',
      projectTitle: 'E-commerce Platform with AI Recommendations',
      description: 'A modern e-commerce platform that uses machine learning to provide personalized product recommendations based on user behavior and preferences.',
      technology: ['React.js', 'Node.js', 'MongoDB', 'TensorFlow'],
      teamMembers: [
        { name: 'Ananya Sharma', role: 'Frontend Developer', email: 'ananya@example.com' },
        { name: 'Rahul Verma', role: 'Backend Developer', email: 'rahul@example.com' },
        { name: 'Neha Singh', role: 'UI/UX Designer', email: 'neha@example.com' }
      ],
      status: 'pending',
      submissionDate: '2024-01-20',
      deadline: '2024-01-25',
      documents: [
        { name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'Technical Specifications.docx', type: 'docx', size: '1.8 MB' },
        { name: 'Team Structure.pdf', type: 'pdf', size: '0.9 MB' }
      ],
      previousFeedback: [
        {
          date: '2024-01-18',
          comment: 'Good concept, but need more technical details on AI implementation.',
          status: 'revision_required'
        }
      ]
    },
    {
      id: 'p2',
      groupName: 'Beta Squad',
      projectTitle: 'Real-time Chat Application with End-to-End Encryption',
      description: 'A secure real-time chat application that implements end-to-end encryption using WebRTC and modern cryptographic protocols.',
      technology: ['React.js', 'Socket.io', 'WebRTC', 'Node.js', 'PostgreSQL'],
      teamMembers: [
        { name: 'Vikram Rao', role: 'Full Stack Developer', email: 'vikram@example.com' },
        { name: 'Priya Patel', role: 'Security Specialist', email: 'priya@example.com' },
        { name: 'Amit Kumar', role: 'Backend Developer', email: 'amit@example.com' }
      ],
      status: 'approved',
      submissionDate: '2024-01-18',
      deadline: '2024-01-22',
      documents: [
        { name: 'Security Analysis.pdf', type: 'pdf', size: '3.1 MB' },
        { name: 'Architecture Diagram.pdf', type: 'pdf', size: '1.5 MB' },
        { name: 'Implementation Plan.docx', type: 'docx', size: '2.2 MB' }
      ],
      previousFeedback: [
        {
          date: '2024-01-16',
          comment: 'Excellent security approach. Approved with minor suggestions.',
          status: 'approved'
        }
      ]
    },
    {
      id: 'p3',
      groupName: 'Project Phoenix',
      projectTitle: 'AI-Powered Student Performance Analytics System',
      description: 'An intelligent system that analyzes student performance data to provide insights and recommendations for academic improvement.',
      technology: ['Python', 'TensorFlow', 'React.js', 'FastAPI', 'PostgreSQL'],
      teamMembers: [
        { name: 'Sneha Desai', role: 'AI Developer', email: 'sneha@example.com' },
        { name: 'Rajesh Mehta', role: 'Data Scientist', email: 'rajesh@example.com' },
        { name: 'Pooja Joshi', role: 'Full Stack Developer', email: 'pooja@example.com' }
      ],
      status: 'revision_required',
      submissionDate: '2024-01-15',
      deadline: '2024-01-20',
      documents: [
        { name: 'AI Model Design.pdf', type: 'pdf', size: '4.2 MB' },
        { name: 'Data Flow Diagram.pdf', type: 'pdf', size: '2.1 MB' },
        { name: 'Algorithm Description.docx', type: 'docx', size: '3.5 MB' }
      ],
      previousFeedback: [
        {
          date: '2024-01-13',
          comment: 'AI model needs more validation. Please provide testing strategies.',
          status: 'revision_required'
        }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/30 text-green-300 border-green-400/30';
      case 'revision_required':
        return 'bg-orange-500/30 text-orange-300 border-orange-400/30';
      case 'pending':
        return 'bg-blue-500/30 text-blue-300 border-blue-400/30';
      case 'rejected':
        return 'bg-red-500/30 text-red-300 border-red-400/30';
      default:
        return 'bg-gray-500/30 text-gray-300 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'revision_required':
        return <AlertCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const handleApprove = (projectId) => {
    if (window.confirm('Are you sure you want to approve this project?')) {
      // Update project status in real application
      alert('Project approved successfully!');
    }
  };

  const handleReject = (projectId) => {
    if (window.confirm('Are you sure you want to reject this project?')) {
      // Update project status in real application
      alert('Project rejected. Please provide feedback.');
    }
  };

  const handleFeedback = (project) => {
    setSelectedProject(project);
    setFeedbackData({
      technicalScore: 0,
      innovationScore: 0,
      presentationScore: 0,
      comments: '',
      suggestions: '',
      status: 'pending'
    });
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (feedbackData.comments.trim()) {
      // Submit feedback in real application
      alert('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      setSelectedProject(null);
    } else {
      alert('Please provide feedback comments.');
    }
  };

  const downloadDocument = (document) => {
    // Mock download functionality
    alert(`Downloading ${document.name}`);
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
            Project <span className="text-teal-400">Approval</span>
          </h1>

          <div className="flex gap-2">
            <Link to="/guide/groups" className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">Groups</Link>
            <Link to="/guide/feedback" className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">Feedback</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-white">{projects.length}</p>
              </div>
              <FileText size={32} className="text-teal-400" />
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'pending').length}</p>
              </div>
              <Clock size={32} className="text-orange-400" />
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Approved</p>
                <p className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'approved').length}</p>
              </div>
              <CheckCircle size={32} className="text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Revision Required</p>
                <p className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'revision_required').length}</p>
              </div>
              <AlertCircle size={32} className="text-red-400" />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Project Proposals</h2>
            <div className="flex gap-3">
              <button className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">
                Export Report
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{project.projectTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/70">Group: <span className="text-white">{project.groupName}</span></span>
                      <span className="text-white/70">Submitted: <span className="text-white">{project.submissionDate}</span></span>
                      <span className="text-white/70">Deadline: <span className="text-white">{project.deadline}</span></span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="bg-teal-500/30 text-teal-300 p-2 rounded-lg border border-teal-400/30 hover:bg-teal-500/40 transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleFeedback(project)}
                      className="bg-blue-500/30 text-blue-300 p-2 rounded-lg border border-blue-400/30 hover:bg-blue-500/40 transition"
                      title="Provide Feedback"
                    >
                      <MessageSquare size={16} />
                    </button>
                    {project.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(project.id)}
                          className="bg-green-500/30 text-green-300 p-2 rounded-lg border border-green-400/30 hover:bg-green-500/40 transition"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(project.id)}
                          className="bg-red-500/30 text-red-300 p-2 rounded-lg border border-red-400/30 hover:bg-red-500/40 transition"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Technology Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technology.map((tech, index) => (
                      <span key={index} className="bg-white/10 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Team Members:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="bg-white/10 p-3 rounded-xl border border-white/20">
                        <p className="text-white font-medium text-sm">{member.name}</p>
                        <p className="text-white/70 text-xs">{member.role}</p>
                        <p className="text-white/50 text-xs">{member.email}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Submitted Documents:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.documents.map((doc, index) => (
                      <button
                        key={index}
                        onClick={() => downloadDocument(doc)}
                        className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition flex items-center gap-2"
                      >
                        <Download size={14} />
                        {doc.name}
                        <span className="text-white/50 text-xs">({doc.size})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Previous Feedback */}
                {project.previousFeedback.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Previous Feedback:</h4>
                    <div className="space-y-2">
                      {project.previousFeedback.map((feedback, index) => (
                        <div key={index} className="bg-white/10 p-3 rounded-xl border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white/70 text-xs">{feedback.date}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              feedback.status === 'approved' ? 'bg-green-500/30 text-green-300' :
                              feedback.status === 'revision_required' ? 'bg-orange-500/30 text-orange-300' :
                              'bg-gray-500/30 text-gray-300'
                            }`}>
                              {feedback.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedProject.projectTitle}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Project Information</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-white/80 mb-2"><span className="font-semibold">Group:</span> {selectedProject.groupName}</p>
                  <p className="text-white/80 mb-2"><span className="font-semibold">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </p>
                  <p className="text-white/80 mb-2"><span className="font-semibold">Submission Date:</span> {selectedProject.submissionDate}</p>
                  <p className="text-white/80"><span className="font-semibold">Deadline:</span> {selectedProject.deadline}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-white/80 leading-relaxed">{selectedProject.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technology.map((tech, index) => (
                      <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Team Members</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedProject.teamMembers.map((member, index) => (
                      <div key={index} className="bg-white/20 p-3 rounded-xl">
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-white/70 text-sm">{member.role}</p>
                        <p className="text-white/50 text-xs">{member.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Documents</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <div className="space-y-2">
                    {selectedProject.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/20 p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-teal-400" />
                          <div>
                            <p className="text-white font-medium">{doc.name}</p>
                            <p className="text-white/70 text-sm">{doc.type.toUpperCase()} • {doc.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="bg-teal-500/30 text-teal-300 px-3 py-1 rounded-lg border border-teal-400/30 hover:bg-teal-500/40 transition"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleFeedback(selectedProject)}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                Provide Feedback
              </button>
              {selectedProject.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedProject.id)}
                    className="bg-green-500/30 text-green-300 py-2 px-6 rounded-lg border border-green-400/30 hover:bg-green-500/40 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedProject.id)}
                    className="bg-red-500/30 text-red-300 py-2 px-6 rounded-lg border border-red-400/30 hover:bg-red-500/40 transition"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Provide Feedback</h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{selectedProject.projectTitle}</h3>
                <p className="text-white/70 text-sm">Group: {selectedProject.groupName}</p>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Technical Implementation (0-10)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setFeedbackData({...feedbackData, technicalScore: score})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                        feedbackData.technicalScore >= score 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-white/10 text-white/50 hover:bg-white/20'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Innovation & Creativity (0-10)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setFeedbackData({...feedbackData, innovationScore: score})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                        feedbackData.innovationScore >= score 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-white/10 text-white/50 hover:bg-white/20'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Presentation & Documentation (0-10)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setFeedbackData({...feedbackData, presentationScore: score})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                        feedbackData.presentationScore >= score 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-white/10 text-white/50 hover:bg-white/20'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Comments & Feedback</label>
                <textarea
                  value={feedbackData.comments}
                  onChange={(e) => setFeedbackData({...feedbackData, comments: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Provide detailed feedback on the project..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Suggestions for Improvement</label>
                <textarea
                  value={feedbackData.suggestions}
                  onChange={(e) => setFeedbackData({...feedbackData, suggestions: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Suggest ways to improve the project..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Overall Assessment</label>
                <select
                  value={feedbackData.status}
                  onChange={(e) => setFeedbackData({...feedbackData, status: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="revision_required">Revision Required</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="bg-white/10 text-white py-2 px-6 rounded-lg border border-white/30 hover:bg-white/20 transition flex-1"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition flex-1"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
