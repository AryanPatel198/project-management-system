// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Users, User, BookOpen, Smartphone, Code, Hash, Trash2, Edit, X, ChevronDown, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';

// Reusable FilterDropdown component
const FilterDropdown = ({ title, options, selected, onSelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 bg-white/10 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-white/20 shadow-neumorphic border border-white/20 backdrop-blur-sm w-44 hover:shadow-lg hover:scale-105"
        aria-label={`Select ${title}`}
      >
        <span>{selected || title}</span>
        <ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} text-accent-teal`} />
      </button>
      {isOpen && (
        <div className="absolute top-12 left-0 w-48 bg-white/10 rounded-lg shadow-neumorphic border border-white/20 z-10 transition-all duration-300 backdrop-blur-sm animate-fade-in">
          <ul className="py-2">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                onKeyPress={(e) => e.key === 'Enter' && handleSelect(option)}
                className={`px-4 py-2 cursor-pointer transition-colors duration-300 text-white ${
                  selected === option ? 'bg-accent-teal font-bold' : 'hover:bg-accent-teal/50'
                }`}
                tabIndex={0}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function GroupManagement() {
  const navigate = useNavigate();

  // Sample guide data
  const [guides] = useState([
    { id: 'g1', name: 'Patel Kartik', email: 'kartik21@college.edu', expertise: 'MERN Stack', status: 'Active', mobile: '9876543210' },
    { id: 'g2', name: 'Prof. Jaymin patel', email: 'jaymin08@college.edu', expertise: 'Flutter', status: 'Active', mobile: '9123456789' },
    { id: 'g3', name: 'Shah timir', email: 'shahtimir29@college.edu', expertise: 'PHP', status: 'Inactive', mobile: '9988776655' },
    { id: 'g4', name: 'Dr. Priya Sharma', email: 'priya.s@example.com', expertise: 'Java', status: 'Active', mobile: '9012345678' },
    { id: 'g5', name: 'Dr. Neha Patel', email: 'neha.p@example.com', expertise: 'Machine Learning', status: 'Active', mobile: '9898767654' },
  ]);

  // Sample group data
  const [groups, setGroups] = useState([
    {
      id: 'g1',
      name: 'Alpha Team',
      guide: 'Patel Kartik',
      projectTitle: 'E-commerce Platform',
      projectDescription: 'A web-based platform for online shopping, featuring a user-friendly interface and secure payment gateways.',
      projectTechnology: 'Full Stack MERN',
      year: 2025,
      members: [
        { name: 'Student 1', className: 'BCA 6', enrollment: '2623' },
        { name: 'Student 2', className: 'BCA 6', enrollment: '2647' },
        { name: 'Student 3', className: 'BCA 6', enrollment: '2662' }
      ]
    },
    {
      id: 'g2',
      name: 'Beta Squad',
      guide: 'Prof. Jaymin patel',
      projectTitle: 'Real-time Chat App',
      projectDescription: 'A real-time messaging application with a focus on fast and secure communication between users.',
      projectTechnology: 'Flutter',
      year: 2025,
      members: [
        { name: 'Student 4', className: 'BCA 6', enrollment: '2668' },
        { name: 'Student 5', className: 'BCA 6', enrollment: '2670' },
        { name: 'Student 6', className: 'BCA 6', enrollment: '2681' }
      ]
    },
    {
      id: 'g3',
      name: 'Project Phoenix',
      guide: 'Shah timir',
      projectTitle: 'Online Learning System',
      projectDescription: 'An interactive platform for students to access courses, submit assignments, and track their academic progress.',
      projectTechnology: 'PHP / MySQL',
      year: 2024,
      members: [
        { name: 'Student 7', className: 'BCA 6', enrollment: '2690' },
        { name: 'Student 8', className: 'BCA 6', enrollment: '2695' },
        { name: 'Student 9', className: 'BCA 6', enrollment: '2701' }
      ]
    },
    {
      id: 'g4',
      name: 'Quantum Coders',
      guide: 'Dr. Neha Patel',
      projectTitle: 'AI-based Recommendation System',
      projectDescription: 'A system that provides personalized recommendations to users based on their past behavior and preferences.',
      projectTechnology: 'Python / ML',
      year: 2025,
      members: [
        { name: 'Student 10', className: 'MCA 1', enrollment: '1001' },
        { name: 'Student 11', className: 'MCA 1', enrollment: '1002' },
        { name: 'Student 12', className: 'MCA 1', enrollment: '1003' }
      ]
    },
  ]);

  // Mock data from ManageDivisions.jsx
  const [enrollments] = useState([
    { divisionId: 'd1', enrollmentNumber: 'BCA2025001', isRegistered: true, studentName: 'Student 1' },
    { divisionId: 'd1', enrollmentNumber: 'BCA2025002', isRegistered: false, studentName: null },
    { divisionId: 'd3', enrollmentNumber: 'MCA2025001', isRegistered: true, studentName: 'Student 10' },
    { divisionId: 'd4', enrollmentNumber: 'BCA2025003', isRegistered: true, studentName: 'Student 13' },
  ]);

  const [students] = useState([
    { enrollmentNumber: 'BCA2025001', studentName: 'Student 1', divisionId: 'd1' },
    { enrollmentNumber: 'MCA2025001', studentName: 'Student 10', divisionId: 'd3' },
    { enrollmentNumber: 'BCA2025003', studentName: 'Student 13', divisionId: 'd4' },
  ]);

  const [divisions, setDivisions] = useState([
    { id: 'd1', course: 'BCA', semester: 6, year: 2025, status: 'Active' },
    { id: 'd2', course: 'BCA', semester: 3, year: 2024, status: 'Inactive' },
    { id: 'd3', course: 'MCA', semester: 1, year: 2025, status: 'Active' },
    { id: 'd4', course: 'BCA', semester: 6, year: 2025, status: 'Active' },
  ]);

  // State
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showChangeGuideModal, setShowChangeGuideModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGuide, setNewGuide] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Group creation state
  const [creationStep, setCreationStep] = useState(1);
  const [newGroupData, setNewGroupData] = useState({
    projectTitle: '',
    projectDescription: '',
    projectTechnology: '',
    course: '',
    year: new Date().getFullYear(),
    guide: '',
    selectedDivision: '',
    selectedStudents: []
  });
  const [availableStudents, setAvailableStudents] = useState([]);

  // Update available students when division changes
  useEffect(() => {
    if (newGroupData.selectedDivision) {
      const selectedDiv = divisions.find(d => d.id === newGroupData.selectedDivision);
      if (selectedDiv && selectedDiv.course === newGroupData.course && selectedDiv.year === newGroupData.year && selectedDiv.status === 'Active') {
        const groupEnrollmentNumbers = groups.flatMap(group => group.members.map(member => member.enrollment));
        const filteredEnrollments = enrollments.filter(enrollment => 
          enrollment.divisionId === newGroupData.selectedDivision &&
          enrollment.isRegistered &&
          !groupEnrollmentNumbers.includes(enrollment.enrollmentNumber)
        );
        setAvailableStudents(filteredEnrollments.map(enrollment => {
          const student = students.find(s => s.enrollmentNumber === enrollment.enrollmentNumber);
          return {
            enrollmentNumber: enrollment.enrollmentNumber,
            name: student ? student.studentName : enrollment.studentName || 'Unknown',
            className: `${selectedDiv.course} ${selectedDiv.semester}`
          };
        }));
      } else {
        setAvailableStudents([]);
      }
    } else {
      setAvailableStudents([]);
    }
  }, [newGroupData.selectedDivision, newGroupData.course, newGroupData.year, divisions, enrollments, students, groups]);

  // Filter options
  const allClassNames = ['All', ...new Set(groups.flatMap(group => group.members.map(member => member.className)))];
  const allYears = ['All Years', ...new Set(groups.map(group => group.year.toString()))].sort().reverse();
  const currentYear = new Date().getFullYear().toString();
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [selectedYearFilter, setSelectedYearFilter] = useState(currentYear);

  // Get active guides
  const activeGuides = guides.filter(guide => guide.status === 'Active');

  // Get active divisions for course and year
  const getActiveDivisions = () => {
    return divisions.filter(d =>
      d.status === 'Active' &&
      d.course === newGroupData.course &&
      d.year === newGroupData.year
    );
  };

  // Get available students (not in any group, matching course, semester, and year)
  const getAvailableStudents = () => {
    if (!selectedGroup || !selectedGroup.members[0]) {
      return [];
    }

    // Parse group course and semester from className (e.g., "BCA 6" -> { course: "BCA", semester: 6 })
    const classNameParts = selectedGroup.members[0].className.split(' ');
    const groupCourse = classNameParts[0]; // e.g., "BCA"
    const groupSemester = parseInt(classNameParts[1], 10); // e.g., 6
    const groupYear = selectedGroup.year; // e.g., 2025

    const groupEnrollmentNumbers = groups.flatMap(group => group.members.map(member => member.enrollment));

    return enrollments
      .filter(enrollment => {
        // Exclude students already in any group
        if (groupEnrollmentNumbers.includes(enrollment.enrollmentNumber)) {
          return false;
        }
        // Find matching division
        const division = divisions.find(d => d.id === enrollment.divisionId);
        if (!division) {
          return false;
        }
        // Match course, semester, and year
        return (
          division.course === groupCourse &&
          division.semester === groupSemester &&
          division.year === groupYear
        );
      })
      .map(enrollment => {
        const student = students.find(s => s.enrollmentNumber === enrollment.enrollmentNumber);
        const division = divisions.find(d => d.id === enrollment.divisionId);
        return {
          enrollmentNumber: enrollment.enrollmentNumber,
          name: student ? student.studentName : enrollment.studentName || 'Unknown',
          className: division ? `${division.course} ${division.semester}` : 'Unknown'
        };
      });
  };

  // Filtered groups
  const filteredGroups = groups.filter(group => {
    const matchesClassFilter = selectedClassFilter === 'All' || group.members.some(member => member.className === selectedClassFilter);
    const matchesYearFilter = selectedYearFilter === 'All Years' || group.year.toString() === selectedYearFilter;
    return matchesClassFilter && matchesYearFilter;
  });

  // Handlers
  const handleBack = () => {
    navigate('/home', { replace: true });
  };

  const handleViewDetails = (group) => {
    setSelectedGroup(group);
  };

  const handleBackToList = () => {
    setSelectedGroup(null);
  };

  const getGuideDetails = (guideName) => {
    return guides.find(guide => guide.name === guideName) || {};
  };

  const openChangeGuideModal = () => {
    setNewGuide(selectedGroup.guide);
    setShowChangeGuideModal(true);
  };

  const handleSaveGuideChange = () => {
    setGroups(groups.map(group =>
      group.id === selectedGroup.id ? { ...group, guide: newGuide } : group
    ));
    setSelectedGroup(prev => ({ ...prev, guide: newGuide }));
    setShowChangeGuideModal(false);
    setSuccessMessage(`Guide for ${selectedGroup.name} changed successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    console.log(`Group ${selectedGroup.name} guide changed to ${newGuide}`);
  };

  const handleDeleteGroup = () => {
    const deletedGroupName = selectedGroup.name;
    setGroups(groups.filter(group => group.id !== selectedGroup.id));
    setSelectedGroup(null);
    setShowDeleteModal(false);
    setSuccessMessage(`Group "${deletedGroupName}" deleted successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    console.log(`Deleted Group: ${deletedGroupName}`);
  };

  const handleAddStudent = () => {
    if (selectedGroup.members.length >= 4) {
      setSuccessMessage('Cannot add more than 4 students to a group!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (!newStudent) {
      setSuccessMessage('Please select a student to add!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    const studentData = getAvailableStudents().find(s => s.enrollmentNumber === newStudent);
    if (!studentData) {
      setSuccessMessage('Selected student is not available!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    const newMember = {
      name: studentData.name,
      enrollment: studentData.enrollmentNumber,
      className: studentData.className
    };
    setGroups(groups.map(group =>
      group.id === selectedGroup.id
        ? { ...group, members: [...group.members, newMember] }
        : group
    ));
    setSelectedGroup(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
    setShowAddStudentModal(false);
    setNewStudent('');
    setSuccessMessage(`Student ${studentData.name} added to ${selectedGroup.name}!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    console.log(`Added student ${studentData.name} to ${selectedGroup.name}`);
  };

  const handleDeleteStudent = () => {
    if (selectedGroup.members.length <= 3) {
      setSuccessMessage('Cannot remove student: Minimum 3 students required!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteStudentModal(false);
      return;
    }
    setGroups(groups.map(group =>
      group.id === selectedGroup.id
        ? { ...group, members: group.members.filter(m => m.enrollment !== studentToDelete.enrollment) }
        : group
    ));
    setSelectedGroup(prev => ({
      ...prev,
      members: prev.members.filter(m => m.enrollment !== studentToDelete.enrollment)
    }));
    setShowDeleteStudentModal(false);
    setSuccessMessage(`Student ${studentToDelete.name} removed from ${selectedGroup.name}!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    console.log(`Removed student ${studentToDelete.name} from ${selectedGroup.name}`);
  };

  // Render details view
  const renderDetailsView = () => {
    const guideDetails = getGuideDetails(selectedGroup.guide);
    const hasMembers = selectedGroup.members && selectedGroup.members.length > 0;

    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToList}
            className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Back to groups list"
          >
            <ChevronLeft size={20} className="mr-2" /> Back to Groups
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg flex-grow text-center tracking-tight">
            {selectedGroup.name}
          </h1>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center bg-red-500/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Delete group"
          >
            <Trash2 size={20} className="mr-2" /> Delete Group
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30">
            <h2 className="text-2xl font-bold text-accent-teal mb-4">Project Details</h2>
            <div className="space-y-4 text-white/90">
              <div className="flex items-center">
                <BookOpen size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                <p className="font-semibold">Project Title:</p>
                <span className="ml-2">{selectedGroup.projectTitle}</span>
              </div>
              <div className="flex items-center">
                <Users size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                <p className="font-semibold">Course:</p>
                <span className="ml-2">{selectedGroup.members[0]?.className}</span>
              </div>
              <div className="flex items-center">
                <span className="text-accent-teal text-lg mr-3">🗓️</span>
                <p className="font-semibold">Year:</p>
                <span className="ml-2">{selectedGroup.year}</span>
              </div>
              <div className="flex items-center">
                <Code size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                <p className="font-semibold">Technology:</p>
                <span className="ml-2">{selectedGroup.projectTechnology}</span>
              </div>
              <div>
                <p className="font-semibold mb-1">Description:</p>
                <p className="text-sm">{selectedGroup.projectDescription}</p>
              </div>
            </div>
          </div>

          <div className="bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-accent-teal">Guide Details</h2>
              <button
                onClick={openChangeGuideModal}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Change guide"
              >
                <Edit size={20} className="mr-2" /> Change Guide
              </button>
            </div>
            <div className="space-y-4 text-white/90">
              <div className="flex items-center">
                <User size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                <p className="font-semibold">Name:</p>
                <span className="ml-2">{guideDetails.name}</span>
              </div>
              <div className="flex items-center">
                <Code size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                <p className="font-semibold">Expertise:</p>
                <span className="ml-2">{guideDetails.expertise}</span>
              </div>
              <div className="flex items-center">
                <Smartphone size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                <p className="font-semibold">Mobile:</p>
                <span className="ml-2">{guideDetails.mobile}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-accent-teal">Group Members</h2>
            <button
              onClick={() => setShowAddStudentModal(true)}
              disabled={!hasMembers}
              className={`flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once ${
                !hasMembers ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 hover:scale-105'
              }`}
              aria-label="Add student"
            >
              <Plus size={20} className="mr-2" /> Add Student
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {selectedGroup.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="flex items-center">
                  <User size={24} className="text-accent-teal mr-4 animate-icon-pulse" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-white">{member.name}</span>
                    <div className="text-sm text-white/80 flex items-center">
                      <Hash size={16} className="mr-1 text-accent-teal" />
                      <span>{member.enrollment}</span>
                      <span className="ml-4">{member.className}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setStudentToDelete(member);
                    setShowDeleteStudentModal(true);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  aria-label={`Remove student ${member.name}`}
                >
                  <Trash2 size={24} className="animate-icon-pulse" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={20} className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg flex-grow text-center tracking-tight">
            Manage Groups
          </h1>
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Create new group"
          >
            <Plus size={20} className="mr-2" /> Create Group
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <FilterDropdown
            title="Courses"
            options={allClassNames}
            selected={selectedClassFilter}
            onSelect={setSelectedClassFilter}
          />
          <FilterDropdown
            title="Years"
            options={allYears}
            selected={selectedYearFilter}
            onSelect={setSelectedYearFilter}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => (
              <div
                key={group.id}
                onClick={() => handleViewDetails(group)}
                className="bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30 flex flex-col justify-between cursor-pointer hover:scale-[1.02] hover:bg-white/20 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
                aria-label={`View details for ${group.name}`}
              >
                <div>
                  <div className="flex items-center text-xl font-bold text-accent-teal mb-2">
                    <Users size={24} className="mr-3 animate-icon-pulse" />
                    <span className="text-white">{group.name}</span>
                  </div>
                  <div className="space-y-2 text-white/90">
                    <div className="flex items-center">
                      <BookOpen size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                      <p className="font-semibold">Project Title:</p>
                      <span className="ml-2">{group.projectTitle}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={20} className="mr-3 text-accent-teal animate-icon-pulse" />
                      <p className="font-semibold">Guide:</p>
                      <span className="ml-2">{group.guide}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/70 text-center col-span-full py-8 text-lg">No groups found.</p>
          )}
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-teal-900 font-sans text-white">
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes icon-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          .animate-pulse-once {
            animation: pulse-once 0.5s ease-in-out;
          }
          .animate-icon-pulse {
            animation: icon-pulse 2s infinite ease-in-out;
          }
          .bg-particles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Ccircle fill='%2300b8d4' cx='100' cy='100' r='5'/%3E%3Ccircle fill='%2300b8d4' cx='700' cy='200' r='4'/%3E%3Ccircle fill='%2300b8d4' cx='300' cy='600' r='6'/%3E%3Ccircle fill='%2300b8d4' cx='500' cy='400' r='5'/%3E%3C/svg%3E") repeat;
            opacity: 0.1;
          }
          .guide-select option, .student-select option {
            color: white;
            background: rgba(0, 0, 0, 0.8);
          }
        `}
      </style>
      <div className="bg-particles" />
      {successMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-teal to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg shadow-neumorphic border border-white/20 backdrop-blur-sm z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      {selectedGroup ? renderDetailsView() : renderListView()}

      {/* Change Guide Modal */}
      {showChangeGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-light-glass backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-sm relative transform transition-all duration-200 scale-100 hover:scale-102">
            <button
              onClick={() => setShowChangeGuideModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Change Guide</h2>
            <label htmlFor="new-guide-select" className="block text-white text-sm font-semibold mb-2">Select a new guide</label>
            <div className="relative">
              <select
                id="new-guide-select"
                className="guide-select w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm appearance-none cursor-pointer pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em'
                }}
                value={newGuide}
                onChange={(e) => setNewGuide(e.target.value)}
              >
                {activeGuides.map(guide => (
                  <option key={guide.id} value={guide.name}>{guide.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowChangeGuideModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel changing guide"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGuideChange}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Change guide"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-light-glass backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-sm relative transform transition-all duration-200 scale-100 hover:scale-102">
            <button
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Add Student</h2>
            <label htmlFor="new-student-select" className="block text-white text-sm font-semibold mb-2">Select a student</label>
            <div className="relative">
              <select
                id="new-student-select"
                className="student-select w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm appearance-none cursor-pointer pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em'
                }}
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
              >
                <option value="">Select a student</option>
                {getAvailableStudents().length > 0 ? (
                  getAvailableStudents().map(student => (
                    <option key={student.enrollmentNumber} value={student.enrollmentNumber}>
                      {student.name} ({student.enrollmentNumber})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No eligible students available</option>
                )}
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel adding student"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddStudent}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Add student"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {showDeleteStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-light-glass backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-sm relative transform transition-all duration-200 scale-100 hover:scale-102">
            <button
              onClick={() => setShowDeleteStudentModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Confirm Removal</h2>
            <p className="text-white/80 text-center mb-6">
              Are you sure you want to remove <span className="font-semibold text-accent-teal">{studentToDelete.name}</span> from <span className="font-semibold text-accent-teal">{selectedGroup.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeleteStudentModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel removing student"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="flex items-center bg-red-500/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Remove student"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-light-glass backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-sm relative transform transition-all duration-200 scale-100 hover:scale-102">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Confirm Deletion</h2>
            <p className="text-white/80 text-center mb-6">
              Are you sure you want to delete the group <span className="font-semibold text-accent-teal">"{selectedGroup.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel deleting group"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="flex items-center bg-red-500/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Delete group"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-light-glass backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-lg relative transform transition-all duration-200 scale-100 hover:scale-102">
            <button
              onClick={() => setShowCreateGroupModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Create New Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Project Title</label>
                <input
                  type="text"
                  value={newGroupData.projectTitle}
                  onChange={(e) => setNewGroupData({ ...newGroupData, projectTitle: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Project Description</label>
                <textarea
                  value={newGroupData.projectDescription}
                  onChange={(e) => setNewGroupData({ ...newGroupData, projectDescription: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                  placeholder="Enter project description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Technology</label>
                <input
                  type="text"
                  value={newGroupData.projectTechnology}
                  onChange={(e) => setNewGroupData({ ...newGroupData, projectTechnology: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                  placeholder="e.g., MERN Stack"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Course</label>
                  <select
                    value={newGroupData.course}
                    onChange={(e) => setNewGroupData({ ...newGroupData, course: e.target.value })}
                    className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                  >
                    <option value="">Select Course</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Year</label>
                  <select
                    value={newGroupData.year}
                    onChange={(e) => setNewGroupData({ ...newGroupData, year: parseInt(e.target.value) })}
                    className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Division</label>
                <select
                  value={newGroupData.selectedDivision}
                  onChange={(e) => setNewGroupData({ ...newGroupData, selectedDivision: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                >
                  <option value="">Select Division</option>
                  {getActiveDivisions().map(division => (
                    <option key={division.id} value={division.id}>{division.course} {division.semester} - {division.year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Guide</label>
                <select
                  value={newGroupData.guide}
                  onChange={(e) => setNewGroupData({ ...newGroupData, guide: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 shadow-neumorphic backdrop-blur-sm"
                >
                  <option value="">Select Guide</option>
                  {activeGuides.map(guide => (
                    <option key={guide.id} value={guide.name}>{guide.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Select Students</label>
                <div className="max-h-40 overflow-y-auto bg-white/10 rounded-lg p-3 border border-white/20">
                  {availableStudents.length > 0 ? (
                    availableStudents.map(student => (
                      <div key={student.enrollmentNumber} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={student.enrollmentNumber}
                          checked={newGroupData.selectedStudents.includes(student.enrollmentNumber)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewGroupData({ ...newGroupData, selectedStudents: [...newGroupData.selectedStudents, student.enrollmentNumber] });
                            } else {
                              setNewGroupData({ ...newGroupData, selectedStudents: newGroupData.selectedStudents.filter(s => s !== student.enrollmentNumber) });
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={student.enrollmentNumber} className="text-white">{student.name} ({student.enrollmentNumber})</label>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/70">No students available for selected division.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel creating group"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newGroupData.selectedStudents.length < 3) {
                    setSuccessMessage('Please select at least 3 students.');
                    return;
                  }
                  const newGroup = {
                    id: `g${groups.length + 1}`,
                    name: `Group ${groups.length + 1}`,
                    guide: newGroupData.guide,
                    projectTitle: newGroupData.projectTitle,
                    projectDescription: newGroupData.projectDescription,
                    projectTechnology: newGroupData.projectTechnology,
                    year: newGroupData.year,
                    members: newGroupData.selectedStudents.map(enrollment => {
                      const student = availableStudents.find(s => s.enrollmentNumber === enrollment);
                      return {
                        name: student.name,
                        enrollment: student.enrollmentNumber,
                        className: student.className
                      };
                    })
                  };
                  setGroups([...groups, newGroup]);
                  setShowCreateGroupModal(false);
                  setNewGroupData({
                    projectTitle: '',
                    projectDescription: '',
                    projectTechnology: '',
                    course: '',
                    year: new Date().getFullYear(),
                    guide: '',
                    selectedDivision: '',
                    selectedStudents: []
                  });
                  setSuccessMessage('Group created successfully!');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Create group"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupManagement;