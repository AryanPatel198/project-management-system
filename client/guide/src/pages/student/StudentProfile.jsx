import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, BookOpen, Calendar, GraduationCap, 
  MapPin, Clock, Award, ChevronLeft, Edit 
} from 'lucide-react';

function StudentProfile() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Fetch student data on component mount
  useEffect(() => {
    // Simulate fetching student data (in real app, this would be an API call)
    const fetchStudentData = async () => {
      // Mock student data with comprehensive details
      const mockStudentData = {
        name: "Aaryan Patel",
        enrollmentNumber: "ENR001",
        department: "Computer Science",
        semester: "3rd Semester",
        email: "aaryan.patel@example.com",
        phone: "+91 9876543210",
        dateOfBirth: "2002-05-15",
        address: "123 Main Street, Mumbai, Maharashtra",
        admissionYear: "2022",
        expectedGraduation: "2025",
        courses: [
          "Data Structures and Algorithms",
          "Database Management Systems",
          "Web Development",
          "Machine Learning",
          "Software Engineering"
        ],
        achievements: [
          "Academic Excellence Award 2023",
          "Best Project Award - Hackathon 2023",
          "Dean's List - Semester 2"
        ],
        profileImage: null
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudentData(mockStudentData);
      setEditData(mockStudentData);
    };

    fetchStudentData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setStudentData(editData);
    setIsEditing(false);
    // In real app, this would be an API call to update the data
    console.log('Student data updated:', editData);
  };

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 font-sans">
      {/* Header */}
      <div className="sticky top-0 w-full bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-white hover:text-blue-400 transition duration-200"
          >
            <ChevronLeft size={24} className="mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-white">
            Student <span className="text-blue-400">Profile</span>
          </h1>
          
          <button
            onClick={handleEditToggle}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            <Edit size={18} className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white mb-2">{studentData.name}</h2>
              <p className="text-white/70 text-lg">{studentData.enrollmentNumber}</p>
              <p className="text-blue-400 font-semibold">{studentData.department}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User size={24} className="text-blue-400 mr-3" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <DetailItem 
                icon={Mail} 
                label="Email" 
                value={isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-2 bg-white/10 text-white rounded border border-white/20"
                  />
                ) : studentData.email}
              />
              <DetailItem 
                icon={Phone} 
                label="Phone" 
                value={isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-2 bg-white/10 text-white rounded border border-white/20"
                  />
                ) : studentData.phone}
              />
              <DetailItem 
                icon={Calendar} 
                label="Date of Birth" 
                value={isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full p-2 bg-white/10 text-white rounded border border-white/20"
                  />
                ) : studentData.dateOfBirth}
              />
              <DetailItem 
                icon={MapPin} 
                label="Address" 
                value={isEditing ? (
                  <textarea
                    value={editData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-2 bg-white/10 text-white rounded border border-white/20 resize-none"
                    rows={3}
                  />
                ) : studentData.address}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <GraduationCap size={24} className="text-blue-400 mr-3" />
              Academic Information
            </h3>
            <div className="space-y-4">
              <DetailItem icon={BookOpen} label="Semester" value={studentData.semester} />
              <DetailItem icon={Calendar} label="Admission Year" value={studentData.admissionYear} />
              <DetailItem icon={Calendar} label="Expected Graduation" value={studentData.expectedGraduation} />
              <DetailItem icon={Award} label="CGPA" value={studentData.cgpa} />
              <DetailItem icon={Clock} label="Attendance" value={studentData.attendance} />
            </div>
          </div>

          {/* Current Courses
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Current Courses</h3>
            <div className="space-y-2">
              {studentData.courses.map((course, index) => (
                <div key={index} className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  {course}
                </div>
              ))}
            </div>
          </div> */}

          {/* Achievements
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Achievements</h3>
            <div className="space-y-3">
              {studentData.achievements.map((achievement, index) => (
                <div key={index} className="bg-blue-600/20 p-3 rounded-lg border border-blue-400/30">
                  <p className="text-white">{achievement}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Save Button (only shown in edit mode) */}
        {isEditing && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for detail items
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/10">
    <div className="flex items-center">
      <Icon size={18} className="text-blue-400 mr-3" />
      <span className="text-white/70">{label}:</span>
    </div>
    <div className="text-white font-medium">
      {value}
    </div>
  </div>
);

export default StudentProfile;
