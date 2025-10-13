import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupManagement() {
  const navigate = useNavigate();
  // Assuming logged-in student's enrollment
  const loggedInEnrollment = 'ENR001';
  const [currentGroup, setCurrentGroup] = useState(null); // null if not in group
  // Static list of available students with enrollment numbers (mock data)
  const [availableStudents] = useState([
    { enrollment: 'ENR001', name: 'Alice' },
    { enrollment: 'ENR002', name: 'Bob' },
    { enrollment: 'ENR003', name: 'Charlie' },
    { enrollment: 'ENR004', name: 'Diana' },
    { enrollment: 'ENR005', name: 'Edward' },
    { enrollment: 'ENR006', name: 'Fatima' },
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', technology: '' });
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [editGroup, setEditGroup] = useState({ name: '', description: '', technology: '' });

  const handleCreateGroup = () => {
    if (newGroup.name.trim() !== '' && newGroup.description.trim() !== '' && newGroup.technology.trim() !== '') {
      if (selectedEnrollments.length < 2 || selectedEnrollments.length > 3) { // 2-3 additional students
        alert('Please select 2 or 3 additional students.');
        return;
      }
      const group = {
        id: 1,
        name: newGroup.name,
        description: newGroup.description,
        technology: newGroup.technology,
        members: [{ enrollment: loggedInEnrollment, name: availableStudents.find(s => s.enrollment === loggedInEnrollment).name }, ...selectedEnrollments.map(enrollment => ({ enrollment, name: availableStudents.find(s => s.enrollment === enrollment).name }))],
        progress: 0
      };
      setCurrentGroup(group);
      setNewGroup({ name: '', description: '', technology: '' });
      setSelectedEnrollments([]);
      setShowCreateForm(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleEditGroup = () => {
    if (editGroup.name.trim() !== '' && editGroup.description.trim() !== '' && editGroup.technology.trim() !== '') {
      setCurrentGroup({
        ...currentGroup,
        name: editGroup.name,
        description: editGroup.description,
        technology: editGroup.technology
      });
      setIsEditing(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const startEdit = () => {
    setEditGroup({
      name: currentGroup.name,
      description: currentGroup.description,
      technology: currentGroup.technology
    });
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Group Management</h1>
        
        {currentGroup ? (
          // Show Group Details
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 mb-8 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{currentGroup.name}</h2>
              <button
                onClick={startEdit}
                className="bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
              >
                Edit Details
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-accent-teal mb-2">Description</h3>
                <p className="text-white/90 bg-gray-800/50 p-3 rounded-lg">{currentGroup.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-accent-teal mb-2">Technology</h3>
                <p className="text-white/90 bg-gray-800/50 p-3 rounded-lg">{currentGroup.technology}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-accent-teal mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {currentGroup.members.map(member => (
                    <span key={member.enrollment} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm text-white/90">
                      {member.name} ({member.enrollment})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Show Create Group Form
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Group</h2>
            <p className="text-white/70 text-sm mb-6">Fill in the details and select 2-3 additional students to form your group.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white mb-2">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                  placeholder="Enter group description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Technology</label>
                <input
                  type="text"
                  value={newGroup.technology}
                  onChange={(e) => setNewGroup({...newGroup, technology: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                  placeholder="e.g., React, Node.js"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Select Students (Enrollment)</label>
                <div className="bg-white/10 border border-white/20 rounded-xl p-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedEnrollments.length === 0 && (
                      <span className="text-white/60 text-sm">No students selected</span>
                    )}
                    {selectedEnrollments.map(enr => (
                      <span key={enr} className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 px-2.5 py-1 rounded-full text-xs">
                        {enr}
                        <button onClick={() => setSelectedEnrollments(selectedEnrollments.filter(e => e !== enr))} className="text-cyan-200/90 hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableStudents.filter(s => s.enrollment !== loggedInEnrollment).map(s => {
                      const isSelected = selectedEnrollments.includes(s.enrollment);
                      const isDisabled = !isSelected && selectedEnrollments.length >= 3;
                      return (
                        <button
                          key={s.enrollment}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedEnrollments(selectedEnrollments.filter(e => e !== s.enrollment));
                            } else if (!isDisabled) {
                              setSelectedEnrollments([...selectedEnrollments, s.enrollment]);
                            }
                          }}
                          disabled={isDisabled}
                          className={
                            `text-left rounded-lg px-3 py-2 border transition duration-150 ` +
                            (isSelected
                              ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                              : isDisabled
                                ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/15')
                          }
                        >
                          <div className="text-xs font-semibold">{s.enrollment}</div>
                          <div className="text-[11px] text-white/70">{s.name}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-white/70 text-xs">Selected {selectedEnrollments.length} (2-3 required)</div>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleCreateGroup}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2.5 px-7 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.01] transition duration-200"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Group Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white mb-2">Group Name</label>
                <input
                  type="text"
                  value={editGroup.name}
                  onChange={(e) => setEditGroup({...editGroup, name: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={editGroup.description}
                  onChange={(e) => setEditGroup({...editGroup, description: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Technology</label>
                <input
                  type="text"
                  value={editGroup.technology}
                  onChange={(e) => setEditGroup({...editGroup, technology: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditGroup}
                  className="bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/student/dashboard')}
          className="bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default GroupManagement;
