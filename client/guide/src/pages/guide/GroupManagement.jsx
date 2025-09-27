import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Users, Plus, Edit, Trash2, Eye, UserPlus, BookOpen, Calendar, BarChart3 } from 'lucide-react';

export default function GroupManagement() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    groupName: '',
    projectTitle: '',
    description: '',
    maxMembers: 4
  });

  // Mock data for groups
  useEffect(() => {
    setGroups([
      {
        id: 'g1',
        groupName: 'Alpha Team',
        projectTitle: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        maxMembers: 4,
        currentMembers: 3,
        status: 'Active',
        startDate: '2024-01-01',
        endDate: '2024-04-30',
        members: [
          { id: 's1', name: 'Ananya Sharma', email: 'ananya@example.com', role: 'Team Lead' },
          { id: 's2', name: 'Rahul Verma', email: 'rahul@example.com', role: 'Developer' },
          { id: 's3', name: 'Neha Singh', email: 'neha@example.com', role: 'Designer' }
        ]
      },
      {
        id: 'g2',
        groupName: 'Beta Squad',
        projectTitle: 'Real-time Chat App',
        description: 'Developing a real-time chat application using WebSocket technology',
        maxMembers: 4,
        currentMembers: 3,
        status: 'Active',
        startDate: '2024-01-05',
        endDate: '2024-04-25',
        members: [
          { id: 's4', name: 'Vikram Rao', email: 'vikram@example.com', role: 'Team Lead' },
          { id: 's5', name: 'Priya Patel', email: 'priya@example.com', role: 'Developer' },
          { id: 's6', name: 'Amit Kumar', email: 'amit@example.com', role: 'Backend Developer' }
        ]
      },
      {
        id: 'g3',
        groupName: 'Project Phoenix',
        projectTitle: 'AI Recommendation System',
        description: 'Creating an AI-powered recommendation system for e-commerce',
        maxMembers: 4,
        currentMembers: 3,
        status: 'Completed',
        startDate: '2023-09-01',
        endDate: '2023-12-31',
        members: [
          { id: 's7', name: 'Sneha Desai', email: 'sneha@example.com', role: 'Team Lead' },
          { id: 's8', name: 'Rajesh Mehta', email: 'rajesh@example.com', role: 'AI Developer' },
          { id: 's9', name: 'Pooja Joshi', email: 'pooja@example.com', role: 'Data Scientist' }
        ]
      }
    ]);
  }, []);

  const handleAddGroup = () => {
    if (formData.groupName && formData.projectTitle) {
      const newGroup = {
        id: `g${Date.now()}`,
        ...formData,
        currentMembers: 0,
        status: 'Active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        members: []
      };
      setGroups([...groups, newGroup]);
      setShowAddModal(false);
      setFormData({ groupName: '', projectTitle: '', description: '', maxMembers: 4 });
    }
  };

  const handleEditGroup = () => {
    if (selectedGroup && formData.groupName && formData.projectTitle) {
      const updatedGroups = groups.map(group =>
        group.id === selectedGroup.id
          ? { ...group, ...formData }
          : group
      );
      setGroups(updatedGroups);
      setShowEditModal(false);
      setSelectedGroup(null);
      setFormData({ groupName: '', projectTitle: '', description: '', maxMembers: 4 });
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter(group => group.id !== groupId));
    }
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setFormData({
      groupName: group.groupName,
      projectTitle: group.projectTitle,
      description: group.description,
      maxMembers: group.maxMembers
    });
    setShowEditModal(true);
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
            Group <span className="text-teal-400">Management</span>
          </h1>

          <div className="flex gap-2">
            <Link to="/guide/students" className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">Students</Link>
            <Link to="/guide/profile" className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition">Profile</Link>
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
                <p className="text-white/70 text-sm">Total Groups</p>
                <p className="text-3xl font-bold text-white">{groups.length}</p>
              </div>
              <Users size={32} className="text-teal-400" />
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Groups</p>
                <p className="text-3xl font-bold text-white">{groups.filter(g => g.status === 'Active').length}</p>
              </div>
              <BookOpen size={32} className="text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-white">{groups.reduce((acc, group) => acc + group.currentMembers, 0)}</p>
              </div>
              <UserPlus size={32} className="text-orange-400" />
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Completed</p>
                <p className="text-3xl font-bold text-white">{groups.filter(g => g.status === 'Completed').length}</p>
              </div>
              <BarChart3 size={32} className="text-green-400" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Student Groups</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            <Plus size={18} className="mr-2" />
            Add New Group
          </button>
        </div>

        {/* Groups List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-glow">
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  group.status === 'Active' ? 'bg-green-500/30 text-green-300' :
                  group.status === 'Completed' ? 'bg-blue-500/30 text-blue-300' :
                  'bg-gray-500/30 text-gray-300'
                }`}>
                  {group.status}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="bg-teal-500/30 text-teal-300 p-2 rounded-lg border border-teal-400/30 hover:bg-teal-500/40 transition"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(group)}
                    className="bg-blue-500/30 text-blue-300 p-2 rounded-lg border border-blue-400/30 hover:bg-blue-500/40 transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="bg-red-500/30 text-red-300 p-2 rounded-lg border border-red-400/30 hover:bg-red-500/40 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{group.groupName}</h3>
              <p className="text-white/80 text-sm mb-3">{group.projectTitle}</p>
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{group.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Members:</span>
                  <span className="text-white">{group.currentMembers}/{group.maxMembers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Start Date:</span>
                  <span className="text-white">{group.startDate}</span>
                </div>
                {group.endDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">End Date:</span>
                    <span className="text-white">{group.endDate}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition text-sm flex-1">
                  View Details
                </button>
                <button className="bg-teal-500/30 text-teal-300 py-2 px-4 rounded-lg border border-teal-400/30 hover:bg-teal-500/40 transition text-sm flex-1">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Group</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Group Name</label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Project Title</label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Enter project title"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Maximum Members</label>
                <input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  min="1"
                  max="6"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-white/10 text-white py-2 px-6 rounded-lg border border-white/30 hover:bg-white/20 transition flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGroup}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition flex-1"
              >
                Add Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Group</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Group Name</label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Project Title</label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Enter project title"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Maximum Members</label>
                <input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                  min="1"
                  max="6"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-white/10 text-white py-2 px-6 rounded-lg border border-white/30 hover:bg-white/20 transition flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleEditGroup}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition flex-1"
              >
                Update Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedGroup.groupName} Details</h2>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Project Information</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-white/80"><span className="font-semibold">Title:</span> {selectedGroup.projectTitle}</p>
                  <p className="text-white/80"><span className="font-semibold">Status:</span> {selectedGroup.status}</p>
                  <p className="text-white/80"><span className="font-semibold">Description:</span> {selectedGroup.description}</p>
                  <p className="text-white/80"><span className="font-semibold">Members:</span> {selectedGroup.currentMembers}/{selectedGroup.maxMembers}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Group Members</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  {selectedGroup.members.length > 0 ? (
                    selectedGroup.members.map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-white/60 text-sm">{member.email}</p>
                          </div>
                        </div>
                        <span className="text-teal-400 text-sm font-medium">{member.role}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60 text-center py-4">No members assigned yet</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Timeline</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-white/80"><span className="font-semibold">Start Date:</span> {selectedGroup.startDate}</p>
                  {selectedGroup.endDate && (
                    <p className="text-white/80"><span className="font-semibold">End Date:</span> {selectedGroup.endDate}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition">
                Manage Group
              </button>
              <button className="bg-white/10 text-white py-2 px-6 rounded-lg border border-white/30 hover:bg-white/20 transition">
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
