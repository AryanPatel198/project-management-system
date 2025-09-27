import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Calendar, Building, SlidersHorizontal, Settings, LogOut, Key, User, LayoutGrid } from 'lucide-react';

// Simple error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-4">
          <h2>Error Rendering Home Page</h2>
          <p>{this.state.error?.message || 'An unknown error occurred'}</p>
          <p>Please check the console for details and ensure all dependencies are installed.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Home() {
  const navigate = useNavigate();
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const settingsMenuRef = useRef(null);
  const settingsIconRef = useRef(null);

  // Log to confirm component mounts
  useEffect(() => {
    console.log('Home component mounted');
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

  const goToGuides = () => {
    console.log('Navigating to Guide Management');
    navigate('/admin/guides');
  };

  const goToGroups = () => {
    console.log('Navigating to Group Management');
    navigate('/admin/groups');
  };

  const goToProjects = () => {
    console.log('Navigating to Project Management');
    navigate('/admin/projects');
  };

  const goToExamSchedules = () => {
    console.log('Navigating to Exam Schedules');
    navigate('/admin/schedules');
  };

  const goToDivisions = () => {
    console.log('Navigating to Division Management');
    navigate('/admin/divisions');
  };

  const goToEvaluationParameters = () => {
    console.log('Navigating to Evaluation Parameters');
    navigate('/admin/evaluation-parameters');
  };

  // Settings menu actions
  const handleProfileSettings = () => {
    console.log('Navigating to Settings');
    setIsSettingsMenuOpen(false);
    navigate('/admin/settings');
  };

  const handleChangePassword = () => {
    console.log('Navigating to Settings');
    setIsSettingsMenuOpen(false);
    navigate('/admin/settings');
  };

  const handleLogout = () => {
    console.log('Logging out');
    setIsSettingsMenuOpen(false);
    // Clear the token from localStorage
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // Helper component for a dashboard card
  const DashboardCard = ({ icon: Icon, title, description, onClick, index }) => (
    <div
      className="bg-white/10 backdrop-blur-sm p-12 rounded-3xl shadow-lg border border-white/30 hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center animate-fade-in-up"
      style={{ animationDelay: `${index * 0.15}s` }}
      aria-label={`Navigate to ${title}`}
    >
      <Icon size={80} className="text-cyan-400 mb-4 drop-shadow-md animate-icon-pulse" />
      <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
      {description && <p className="text-xl text-white/90 mb-4 flex-grow">{description}</p>}
      <button
        onClick={onClick}
        className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-6 sm:px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg border border-white/20 backdrop-blur-sm animate-pulse-once"
        aria-label={`Go to ${title.replace('Manage ', '').replace('s', '')}`}
      >
        {`Go to ${title.replace('Manage ', '').replace('s', '')}`}
      </button>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col items-center bg-gray-900 font-sans">
        <style>
          {`
            @keyframes fade-in-up {
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
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.6s ease-out;
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
        <div className="sticky top-0 w-full bg-white/10 backdrop-blur-sm border-b border-white/30 shadow-lg z-10 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              Admin <span className="text-cyan-400">Control Center</span>
            </h1>
            <div className="relative">
              <Settings
                ref={settingsIconRef}
                size={40}
                className={`text-white hover:text-cyan-400 transition duration-200 cursor-pointer drop-shadow-md ${isSettingsMenuOpen ? 'animate-spin' : ''}`}
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                title="System Settings"
                aria-label="Toggle settings menu"
              />
              {isSettingsMenuOpen && (
                <div
                  ref={settingsMenuRef}
                  className="absolute right-0 mt-2 w-52 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 overflow-hidden animate-fade-in transform scale-100 hover:scale-102 transition duration-200"
                >
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleProfileSettings}
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-cyan-400/30 transition duration-150"
                        aria-label="Profile Settings"
                      >
                        <User size={20} className="mr-3 text-white" /> Profile Settings
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleChangePassword}
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-cyan-400/30 transition duration-150"
                        aria-label="Change Password"
                      >
                        <Key size={20} className="mr-3 text-white" /> Change Password
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-cyan-400/30 transition duration-150"
                        aria-label="Logout"
                      >
                        <LogOut size={20} className="mr-3 text-white" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

        <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6">
          {[
            {
              icon: Users,
              title: 'Manage Guides',
              description: 'View, add, edit, and manage guide profiles and assignments.',
              onClick: goToGuides
            },
            {
              icon: LayoutGrid,
              title: 'Manage Groups',
              description: 'Organize and oversee student project groups and memberships.',
              onClick: goToGroups
            },
            {
              icon: Briefcase,
              title: 'Manage Projects',
              description: 'Oversee project assignments, progress, and submissions.',
              onClick: goToProjects
            },
            {
              icon: Calendar,
              title: 'Exam Schedules',
              description: 'Create, update, and manage project and seminar schedules.',
              onClick: goToExamSchedules
            },
            {
              icon: Building,
              title: 'Manage Divisions',
              description: 'Add and manage college divisions and student enrollments.',
              onClick: goToDivisions
            },
            {
              icon: SlidersHorizontal,
              title: 'Evaluation Parameters',
              description: 'Define and update project evaluation criteria and percentages.',
              onClick: goToEvaluationParameters
            }
          ].length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: Users,
                  title: 'Manage Guides',
                  description: 'View, add, edit, and manage guide profiles and assignments.',
                  onClick: goToGuides
                },
                {
                  icon: LayoutGrid,
                  title: 'Manage Groups',
                  description: 'Organize and oversee student project groups and memberships.',
                  onClick: goToGroups
                },
                {
                  icon: Briefcase,
                  title: 'Manage Projects',
                  description: 'Oversee project assignments, progress, and submissions.',
                  onClick: goToProjects
                },
                {
                  icon: Calendar,
                  title: 'Exam Schedules',
                  description: 'Create, update, and manage project and seminar schedules.',
                  onClick: goToExamSchedules
                },
                {
                  icon: Building,
                  title: 'Manage Divisions',
                  description: 'Add and manage college divisions and student enrollments.',
                  onClick: goToDivisions
                },
                {
                  icon: SlidersHorizontal,
                  title: 'Evaluation Parameters',
                  description: 'Define and update project evaluation criteria and percentages.',
                  onClick: goToEvaluationParameters
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
          ) : (
            <div className="text-white text-center p-4">
              No dashboard options available. Please check configuration.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Home;