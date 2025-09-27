// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Users, Trash2, Plus, CheckCircle, Eye, EyeOff, X, ChevronDown, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';

// Type definitions
interface Division {
  id: string;
  course: string;
  semester: number;
  year: number;
  status: 'Active' | 'Inactive';
}

interface Enrollment {
  divisionId: string;
  enrollmentNumber: string;
  isRegistered: boolean;
  studentName: string | null;
}

interface Student {
  enrollmentNumber: string;
  studentName: string;
}

// Mock data for enrollments (will be replaced with API calls)
const mockEnrollments: Enrollment[] = [
  { divisionId: 'd1', enrollmentNumber: 'BCA2025001', isRegistered: true, studentName: 'John Doe' },
  { divisionId: 'd1', enrollmentNumber: 'BCA2025002', isRegistered: false, studentName: null },
  { divisionId: 'd1', enrollmentNumber: 'BCA2025003', isRegistered: true, studentName: 'Jane Smith' },
  { divisionId: 'd2', enrollmentNumber: 'MCA2025001', isRegistered: false, studentName: null },
  { divisionId: 'd2', enrollmentNumber: 'MCA2025002', isRegistered: true, studentName: 'Bob Johnson' },
];

// Reusable FilterDropdown component
function FilterDropdown({ title, options, selected, onSelect }: { title: string, options: string[], selected: string, onSelect: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white/10 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/15 transition-all duration-300 shadow-neumorphic border border-white/20"
      >
        <span className="mr-2">{title}:</span>
        <span className="text-accent-teal">{selected}</span>
        <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-neumorphic border border-white/20 min-w-full z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-white hover:bg-accent-teal/20 transition-colors duration-300 ${
                selected === option ? 'bg-accent-teal/30' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ManageDivisions() {
  const navigate = useNavigate();

  // State
  const [divisions, setDivisions] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [showAddDivisionModal, setShowAddDivisionModal] = useState(false);
  const [showEnrollmentRangeModal, setShowEnrollmentRangeModal] = useState(false);
  const [showAddEnrollmentModal, setShowAddEnrollmentModal] = useState(false);
  const [showDeleteDivisionModal, setShowDeleteDivisionModal] = useState(false);
  const [showDeleteAllEnrollmentsModal, setShowDeleteAllEnrollmentsModal] = useState(false);
  const [newDivision, setNewDivision] = useState({ course: '', semester: '', year: '', status: 'Active' });
  const [enrollmentRange, setEnrollmentRange] = useState({ start: 1, end: 78 });
  const [newEnrollment, setNewEnrollment] = useState({ divisionId: '', enrollmentNumber: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter options
  const courseOptions = ['All', ...new Set(divisions.map(division => division.course))];
  const statusOptions = ['All', 'Active', 'Inactive'];

  // Filtered divisions
  const filteredDivisions = divisions.filter(division => {
    const matchesCourse = courseFilter === 'All' || division.course === courseFilter;
    const matchesStatus = statusFilter === 'All' || division.status === statusFilter;
    return matchesCourse && matchesStatus;
  });

  // Get enrollments with student data
  const getDivisionEnrollments = (divisionId) => {
    return enrollments
      .filter(enrollment => enrollment.divisionId === divisionId)
      .map(enrollment => {
        const student = students.find(s => s.enrollmentNumber === enrollment.enrollmentNumber);
        return {
          ...enrollment,
          studentName: student ? student.studentName : enrollment.studentName,
          isRegistered: student ? true : enrollment.isRegistered
        };
      });
  };

  // Registered count
  const getRegisteredCount = (divisionId) => {
    const divisionEnrollments = getDivisionEnrollments(divisionId);
    const registeredCount = divisionEnrollments.filter(e => e.isRegistered).length;
    return `${registeredCount}/${divisionEnrollments.length}`;
  };

  // Toggle status
  const handleToggleStatus = (division) => {
    const newStatus = division.status === 'Active' ? 'Inactive' : 'Active';
    setDivisions(divisions.map(d => (d.id === division.id ? { ...d, status: newStatus } : d)));
    setSuccessMessage(`Division ${division.course} Sem${division.semester} ${division.year} status updated to ${newStatus}!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add division
  const handleAddDivision = () => {
    if (!newDivision.course || !newDivision.semester || !newDivision.year) {
      setSuccessMessage('Please fill all required fields!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (!/^[A-Za-z]+$/.test(newDivision.course)) {
      setSuccessMessage('Course must contain only letters!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (parseInt(newDivision.semester) < 1 || parseInt(newDivision.semester) > 8) {
      setSuccessMessage('Semester must be between 1 and 8!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (parseInt(newDivision.year) < 2000 || parseInt(newDivision.year) > 2100) {
      setSuccessMessage('Year must be between 2000 and 2100!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    const newId = `d${divisions.length + 1}`;
    setDivisions([...divisions, { id: newId, ...newDivision, semester: parseInt(newDivision.semester), year: parseInt(newDivision.year) }]);
    setShowAddDivisionModal(false);
    setNewDivision({ course: '', semester: '', year: '', status: 'Active' });
    setSuccessMessage(`Division ${newDivision.course} Sem${newDivision.semester} ${newDivision.year} added successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Generate enrollments
  const handleGenerateEnrollments = () => {
    if (enrollmentRange.start < 1 || enrollmentRange.end < enrollmentRange.start || enrollmentRange.end > 999) {
      setSuccessMessage('Invalid range! Start must be >= 1, end must be > start and <= 999.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    const newEnrollments = [];
    for (let i = enrollmentRange.start; i <= enrollmentRange.end; i++) {
      const enrollmentNumber = `${selectedDivision.course}${selectedDivision.year}${i.toString().padStart(3, '0')}`;
      if (!enrollments.some(e => e.enrollmentNumber === enrollmentNumber)) {
        newEnrollments.push({
          divisionId: selectedDivision.id,
          enrollmentNumber,
          isRegistered: false,
          studentName: null,
        });
      }
    }
    if (newEnrollments.length === 0) {
      setSuccessMessage('No new enrollments generated! All numbers in range already exist.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    setEnrollments([...enrollments, ...newEnrollments]);
    setShowEnrollmentRangeModal(false);
    setEnrollmentRange({ start: 1, end: 50 });
    setSuccessMessage(`Generated ${newEnrollments.length} enrollments for ${selectedDivision.course} Sem${selectedDivision.semester} ${selectedDivision.year}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add enrollment
  const handleAddEnrollment = () => {
    if (!newEnrollment.enrollmentNumber) {
      setSuccessMessage('Please enter an enrollment number!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (!/^[A-Za-z]+\d{7}$/.test(newEnrollment.enrollmentNumber)) {
      setSuccessMessage('Enrollment number must be like BCA2025001 (letters followed by 7 digits)!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (enrollments.some(e => e.enrollmentNumber === newEnrollment.enrollmentNumber)) {
      setSuccessMessage('Enrollment number already exists!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    setEnrollments([...enrollments, { ...newEnrollment, isRegistered: false, studentName: null }]);
    setShowAddEnrollmentModal(false);
    setNewEnrollment({ divisionId: '', enrollmentNumber: '' });
    setSuccessMessage(`Enrollment ${newEnrollment.enrollmentNumber} added successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Delete enrollment
  const handleDeleteEnrollment = (enrollmentNumber) => {
    setEnrollments(enrollments.filter(e => e.enrollmentNumber !== enrollmentNumber));
    setSuccessMessage(`Enrollment ${enrollmentNumber} deleted successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Delete all enrollments
  const handleDeleteAllEnrollments = () => {
    setEnrollments(enrollments.filter(e => e.divisionId !== selectedDivision.id));
    setShowDeleteAllEnrollmentsModal(false);
    setSuccessMessage(`All enrollments for ${selectedDivision.course} Sem${selectedDivision.semester} ${selectedDivision.year} deleted successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Delete division
  const handleDeleteDivision = () => {
    setDivisions(divisions.filter(d => d.id !== selectedDivision.id));
    setEnrollments(enrollments.filter(e => e.divisionId !== selectedDivision.id));
    setSelectedDivision(null);
    setShowDeleteDivisionModal(false);
    setSuccessMessage(`Division ${selectedDivision.course} Sem${selectedDivision.semester} ${selectedDivision.year} deleted successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Detailed view
  const renderDetailsView = () => {
    const divisionEnrollments = getDivisionEnrollments(selectedDivision.id);
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSelectedDivision(null)}
            className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Back to divisions list"
          >
            <ChevronLeft size={20} className="mr-2" /> Back to Divisions
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg flex-grow text-center tracking-tight">
            {selectedDivision.course} Sem{selectedDivision.semester} {selectedDivision.year}
          </h1>
          <button
            onClick={() => setShowDeleteDivisionModal(true)}
            className="flex items-center bg-red-500/80 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Delete division"
          >
            <Trash2 size={20} className="mr-2" /> Delete Division
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-neumorphic border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-accent-teal tracking-tight">Enrollment List</h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setNewEnrollment({ divisionId: selectedDivision.id, enrollmentNumber: '' });
                  setShowAddEnrollmentModal(true);
                }}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Add new enrollment"
              >
                <Plus size={20} className="mr-2" /> Add Enrollment
              </button>
              <button
                onClick={() => setShowDeleteAllEnrollmentsModal(true)}
                className="flex items-center bg-red-500/80 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Delete all enrollments"
              >
                <Trash2 size={20} className="mr-2" /> Delete All
              </button>
            </div>
          </div>
          <p className="text-white/80 mb-6 font-semibold">Registered Students: {getRegisteredCount(selectedDivision.id)}</p>
          {divisionEnrollments.length === 0 ? (
            <div className="text-center text-white/70 py-12">
              <p className="text-lg">No enrollments found. Generate enrollment numbers to start.</p>
              <button
                onClick={() => setShowEnrollmentRangeModal(true)}
                className="mt-4 bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Generate enrollments"
              >
                Generate Enrollments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {divisionEnrollments.map((enrollment, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border border-white/20 flex items-center justify-between ${
                    enrollment.isRegistered ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-red-500/20 hover:bg-red-500/30'
                  } transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-center">
                    <Users size={28} className="text-accent-teal mr-4 animate-icon-pulse" />
                    <div>
                      <p className="font-semibold text-white text-lg">{enrollment.enrollmentNumber}</p>
                      <p className="text-sm text-white/80">
                        {enrollment.isRegistered ? `Registered: ${enrollment.studentName}` : 'Not Registered'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEnrollment(enrollment.enrollmentNumber)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    aria-label={`Delete enrollment ${enrollment.enrollmentNumber}`}
                  >
                    <Trash2 size={24} className="animate-icon-pulse" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // List view
  const renderListView = () => (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
          aria-label="Back to dashboard"
        >
          <ChevronLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg flex-grow text-center tracking-tight">
          Manage Divisions
        </h1>
        <button
          onClick={() => setShowAddDivisionModal(true)}
          className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
          aria-label="Add new division"
        >
          <Plus size={20} className="mr-2" /> Add Division
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <FilterDropdown
          title="Course"
          options={courseOptions}
          selected={courseFilter}
          onSelect={setCourseFilter}
        />
        <FilterDropdown
          title="Status"
          options={statusOptions}
          selected={statusFilter}
          onSelect={setStatusFilter}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDivisions.length > 0 ? (
          filteredDivisions.map((division, index) => (
            <div
              key={division.id}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-neumorphic border border-white/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:bg-white/15 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-xl font-bold text-white">
                  <Users size={28} className="text-accent-teal mr-3 animate-icon-pulse" />
                  <span>{division.course} Sem{division.semester} {division.year}</span>
                </div>
                <button
                  onClick={() => handleToggleStatus(division)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    division.status === 'Active' ? 'bg-gradient-to-r from-accent-teal to-cyan-400' : 'bg-gray-600/80'
                  } text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md`}
                  title={division.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}
                  aria-label={`Toggle status for ${division.course} Sem${division.semester} ${division.year}`}
                >
                  {division.status === 'Active' ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
              </div>
              <div className="space-y-3 text-white/90">
                <div className="flex items-center">
                  <CheckCircle size={24} className="mr-3 text-accent-teal animate-icon-pulse" />
                  <p className="font-semibold">Status:</p>
                  <span className="ml-2">{division.status}</span>
                </div>
                <div className="flex items-center">
                  <Users size={24} className="mr-3 text-accent-teal animate-icon-pulse" />
                  <p className="font-semibold">Registered:</p>
                  <span className="ml-2">{getRegisteredCount(division.id)}</span>
                </div>
                <button
                  onClick={() => setSelectedDivision(division)}
                  className="flex items-center w-full bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm mt-4 animate-pulse-once"
                  aria-label={`View enrollments for ${division.course} Sem${division.semester} ${division.year}`}
                >
                  <List size={20} className="mr-2" /> View Enrollments
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/70 text-center col-span-full py-12 text-lg">No divisions found.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-teal-900 font-sans relative overflow-hidden">
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
        `}
      </style>
      <div className="bg-particles" />
      {successMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-teal to-cyan-400 text-white font-semibold px-6 py-3 rounded-lg shadow-neumorphic border border-white/20 backdrop-blur-sm z-50 animate-fade-in">
          {successMessage}
        </div>
      )}
      {selectedDivision ? renderDetailsView() : renderListView()}
      {/* Add Division Modal */}
      {showAddDivisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-md relative transform transition-all duration-300 scale-100 hover:scale-102">
            <button
              onClick={() => setShowAddDivisionModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-300"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">Add Division</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="course" className="block text-lg font-semibold text-white mb-2">Course</label>
                <input
                  id="course"
                  type="text"
                  value={newDivision.course}
                  onChange={(e) => setNewDivision({ ...newDivision, course: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., BCA, MCA"
                />
              </div>
              <div>
                <label htmlFor="semester" className="block text-lg font-semibold text-white mb-2">Semester</label>
                <input
                  id="semester"
                  type="number"
                  value={newDivision.semester}
                  onChange={(e) => setNewDivision({ ...newDivision, semester: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., 1"
                  min="1"
                  max="8"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-lg font-semibold text-white mb-2">Year</label>
                <input
                  id="year"
                  type="number"
                  value={newDivision.year}
                  onChange={(e) => setNewDivision({ ...newDivision, year: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., 2025"
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-lg font-semibold text-white mb-2">Status</label>
                <select
                  id="status"
                  value={newDivision.status}
                  onChange={(e) => setNewDivision({ ...newDivision, status: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em'
                  }}
                >
                  <option value="Active" className="text-white bg-gray-800">Active</option>
                  <option value="Inactive" className="text-white bg-gray-800">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowAddDivisionModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel adding division"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDivision}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Add division"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Enrollment Range Modal */}
      {showEnrollmentRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-md relative transform transition-all duration-300 scale-100 hover:scale-102">
            <button
              onClick={() => setShowEnrollmentRangeModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-300"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">Generate Enrollments</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="start" className="block text-lg font-semibold text-white mb-2">Start Range</label>
                <input
                  id="start"
                  type="number"
                  value={enrollmentRange.start}
                  onChange={(e) => setEnrollmentRange({ ...enrollmentRange, start: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., 1"
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="end" className="block text-lg font-semibold text-white mb-2">End Range</label>
                <input
                  id="end"
                  type="number"
                  value={enrollmentRange.end}
                  onChange={(e) => setEnrollmentRange({ ...enrollmentRange, end: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., 78"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowEnrollmentRangeModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel generating enrollments"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateEnrollments}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Generate enrollments"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Enrollment Modal */}
      {showAddEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-md relative transform transition-all duration-300 scale-100 hover:scale-102">
            <button
              onClick={() => setShowAddEnrollmentModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-300"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">Add Enrollment</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="enrollmentNumber" className="block text-lg font-semibold text-white mb-2">Enrollment Number</label>
                <input
                  id="enrollmentNumber"
                  type="text"
                  value={newEnrollment.enrollmentNumber}
                  onChange={(e) => setNewEnrollment({ ...newEnrollment, enrollmentNumber: e.target.value })}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., BCA2025001"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowAddEnrollmentModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel adding enrollment"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEnrollment}
                className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Add enrollment"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Division Modal */}
      {showDeleteDivisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-md relative transform transition-all duration-300 scale-100 hover:scale-102">
            <button
              onClick={() => setShowDeleteDivisionModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-300"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">Confirm Deletion</h2>
            <p className="text-white/80 text-center mb-6 text-lg">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-accent-teal">
                {selectedDivision.course} Sem{selectedDivision.semester} {selectedDivision.year}
              </span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowDeleteDivisionModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel deleting division"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDivision}
                className="flex items-center bg-red-500/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Confirm delete division"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete All Enrollments Modal */}
      {showDeleteAllEnrollmentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-neumorphic border border-white/20 w-full max-w-md relative transform transition-all duration-300 scale-100 hover:scale-102">
            <button
              onClick={() => setShowDeleteAllEnrollmentsModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-300"
              aria-label="Close modal"
            >
              <X size={24} className="animate-icon-pulse" />
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">Confirm Deletion</h2>
            <p className="text-white/80 text-center mb-6 text-lg">
              Are you sure you want to delete all enrollments for{' '}
              <span className="font-semibold text-accent-teal">
                {selectedDivision.course} Sem{selectedDivision.semester} {selectedDivision.year}
              </span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowDeleteAllEnrollmentsModal(false)}
                className="flex items-center bg-gray-600/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Cancel deleting all enrollments"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllEnrollments}
                className="flex items-center bg-red-500/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                aria-label="Confirm delete all enrollments"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDivisions;