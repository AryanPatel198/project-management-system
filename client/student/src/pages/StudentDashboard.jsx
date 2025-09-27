import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Users, MessageSquare, Bell, Calendar, User, 
  Settings, LogOut, Key, BookOpen, Award, Clock, TrendingUp 
} from 'lucide-react';

function StudentDashboard() {
  const navigate = useNavigate();
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const settingsMenuRef = useRef(null);
  const settingsIconRef = useRef(null);

  // Dummy data for dashboard stats
  const dashboardStats = {
    projectsSubmitted: 2,
    pendingFeedback: 1,
    groupMembers: 3,
    upcomingExams: 2
  };

  // Fetch student data on component mount
  useEffect(() => {
    // Simulate fetching student data (in real app, this would be an API call)
    const fetchStudentData = async () => {
      // Mock student data - replace with actual API call
      const mockStudentData = {
        name: "Aryan Patel",
        enrollmentNumber: "ENR001",
        department: "Computer Science",
        semester: "3rd Semester",
        email: "aaryan.patel@example.com",
        phone: "+91 9876543210",
        profileImage: null
      };
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStudentData(mockStudentData);
    };

    fetchStudentData();
  }, []);

  // Close settings menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target) &&
        settingsIconRef.current &&
        !settingsIconRef.current.contains(event.target)
      ) {
        setIsSettingsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const goToProjectSubmission = () => navigate('/student/project-submission');
  const goToGroupManagement = () => navigate('/student/group-management');
  const goToFeedback = () => navigate('/student/feedback');
  const goToAnnouncements = () => navigate('/student/announcements');
  const goToExamSchedules = () => navigate('/student/exam-schedules');
  const goToGuideDetails = () => navigate('/student/guide-details');
  const goToProfile = () => navigate('/student/profile');
  const goToGroupChat = () => navigate('/student/group-chat');

  const handleProfileSettings = () => {
    setIsSettingsMenuOpen(false);
    navigate('/student/profile');
  };

  const handleChangePassword = () => {
    setIsSettingsMenuOpen(false);
    navigate('/student/settings');
  };

  const handleLogout = () => {
    setIsSettingsMenuOpen(false);
    navigate('/login');
  };

  const DashboardCard = ({ icon: Icon, title, description, onClick, index }) => (
    <div
      className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="p-4 bg-white/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={40} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      {description && <p className="text-white/70 text-sm mb-4 flex-grow">{description}</p>}
      <button className="text-blue-300 hover:text-white text-sm font-semibold transition-colors duration-200">
        Explore →
      </button>
    </div>
  );

  const StatsCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="p-3 bg-white/10 rounded-full">
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 font-sans">
      {/* Header */}
      <div className="sticky top-0 w-full bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BookOpen size={32} className="text-white" />
            <h1 className="text-3xl font-bold text-white">
              Project <span className="text-blue-400">Excellence</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-white font-semibold">
                {studentData ? studentData.name : 'Student'}
              </p>
              <p className="text-white/70 text-sm">
                {studentData ? `${studentData.enrollmentNumber} - ${studentData.department}` : 'Loading...'}
              </p>
            </div>
            
            <div className="relative">
              <Settings
                ref={settingsIconRef}
                size={28}
                className="text-white hover:text-blue-400 transition duration-200 cursor-pointer"
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                title="Settings"
              />
              {isSettingsMenuOpen && (
                <div
                  ref={settingsMenuRef}
                  className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl"
                >
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleProfileSettings}
                        className="flex items-center w-full px-4 py-3 text-white hover:bg-white/10 transition duration-150"
                      >
                        <User size={18} className="mr-3" /> Profile
                      </button>
                    </li>
                    {/* <li>
                      <button
                        onClick={handleChangePassword}
                        className="flex items-center w-full px-4 py-3 text-white hover:bg-white/10 transition duration-150"
                      >
                        <Key size={18} className="mr-3" /> Password
                      </button>
                    </li> */}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-white hover:bg-red-500/20 transition duration-150"
                      >
                        <LogOut size={18} className="mr-3" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, {studentData ? studentData.name : 'Student'}!
          </h2>
          <p className="text-white/70">Ready to continue your academic journey?</p>
        </div>

       {/* Stats Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard 
            icon={FileText} 
            title="Projects Submitted" 
            value={dashboardStats.projectsSubmitted} 
            color="text-green-400" 
          />
          <StatsCard 
            icon={MessageSquare} 
            title="Pending Feedback" 
            value={dashboardStats.pendingFeedback} 
            color="text-yellow-400" 
          />
          <StatsCard 
            icon={Users} 
            title="Group Members" 
            value={dashboardStats.groupMembers} 
            color="text-blue-400" 
          />
          <StatsCard 
            icon={Calendar} 
            title="Upcoming Exams" 
            value={dashboardStats.upcomingExams} 
            color="text-purple-400" 
          />
        </div> */}

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Project Submission',
                description: 'Submit your project work and documents',
                onClick: goToProjectSubmission
              },
              {
                icon: Users,
                title: 'Group Management',
                description: 'Manage your project team members',
                onClick: goToGroupManagement
              },
              {
                icon: MessageSquare,
                title: 'Group Chat',
                description: 'Chat with your group members',
                onClick: goToGroupChat
              },
              {
                icon: MessageSquare,
                title: 'Feedback',
                description: 'View guide feedback and suggestions',
                onClick: goToFeedback
              },
              {
                icon: Bell,
                title: 'Announcements',
                description: 'Important updates from administration',
                onClick: goToAnnouncements
              },
              {
                icon: Calendar,
                title: 'Exam Schedules',
                description: 'View your examination timetable',
                onClick: goToExamSchedules
              },
              {
                icon: User,
                title: 'Guide Details',
                description: 'Contact information and availability',
                onClick: goToGuideDetails
              }
            ].map((card, index) => (
              <DashboardCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
                onClick={card.onClick}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-white/70">
              <Clock size={16} />
              <span>Project "E-Commerce Platform" submitted - 2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-white/70">
              <Award size={16} />
              <span>Received feedback from Dr. Smith - Yesterday</span>
            </div>
            <div className="flex items-center space-x-3 text-white/70">
              <TrendingUp size={16} />
              <span>Group meeting scheduled - Tomorrow 3 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
