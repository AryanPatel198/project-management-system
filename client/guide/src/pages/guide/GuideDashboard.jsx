// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Users2, FileText, MessageSquare, BarChart3, Calendar, User, Edit3, LogOut, Clock, TrendingUp, Award, BookOpen, Bell, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
// Assuming these imports are correct based on your file structure
import { guidePanelAPI, authAPI } from '../../services/api';
import { mockStudents, mockGroups, mockProjects, mockFeedback, mockSchedules, currentGuide } from '../../data/mockData';

export default function GuideDashboard() {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // State for API data
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [guideProfile, setGuideProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Get current guide ID from localStorage or use mock data
  const getCurrentGuideId = () => {
    // @ts-ignore
    const user = authAPI.getCurrentUser();
    return user?.id || 'guide1'; // fallback to mock guide ID
  };

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const guideId = getCurrentGuideId();

        // Try to fetch from API first
        // @ts-ignore
        const [dashboardData, announcementsData, profileData] = await Promise.all([
          guidePanelAPI.getGuideDashboard(guideId),
          guidePanelAPI.getGuideAnnouncements(guideId),
          guidePanelAPI.getGuideProfile(guideId)
        ]);

        setAssignedGroups(dashboardData.data.groups || []);
        setRecentAnnouncements(announcementsData.data || []);
        setGuideProfile(profileData.data);
        setUseMockData(false);

      } catch (apiError) {
        console.warn('API not available, falling back to mock data:', apiError);

        // Fallback to mock data
        setAssignedGroups([
          {
            id: 'g1',
            groupName: 'Alpha Team',
            projectTitle: 'E-commerce Platform',
            status: 'In Progress',
            progress: 75,
            members: ['Ananya Sharma', 'Rahul Verma', 'Neha Singh'],
            lastUpdate: '2024-01-20',
            nextSeminar: '2024-01-25'
          },
          {
            id: 'g2',
            groupName: 'Beta Squad',
            projectTitle: 'Real-time Chat App',
            status: 'Under Review',
            progress: 60,
            members: ['Vikram Rao', 'Priya Patel', 'Amit Kumar'],
            lastUpdate: '2024-01-18',
            nextSeminar: '2024-01-22'
          },
          {
            id: 'g3',
            groupName: 'Project Phoenix',
            projectTitle: 'AI Recommendation System',
            status: 'Completed',
            progress: 100,
            members: ['Sneha Desai', 'Rajesh Mehta', 'Pooja Joshi'],
            lastUpdate: '2024-01-15',
            nextSeminar: 'Final Review'
          }
        ]);

        setRecentAnnouncements([
          {
            id: 'a1',
            title: 'Final Project Submission Deadline',
            content: 'All final project submissions are due by January 30th, 2024.',
            date: '2024-01-20',
            priority: 'high'
          },
          {
            id: 'a2',
            title: 'Evaluation Schedule Update',
            content: 'Project evaluations will be conducted from January 25th to January 28th.',
            date: '2024-01-19',
            priority: 'medium'
          }
        ]);
        
        // @ts-ignore
        setGuideProfile(currentGuide);
        setUseMockData(true);
        setError('Using mock data - API not available');

      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Assigned Groups',
      value: assignedGroups.length.toString(),
      icon: Users2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/20',
      route: '/guide/groups'
    },
    {
      title: 'Pending Reviews',
      value: assignedGroups.filter(g => g.status === 'Under Review').length.toString(),
      icon: FileText,
      color: 'text-amber-400',
      bg: 'bg-amber-400/20',
      route: '/guide/projects'
    },
    {
      title: 'Active Projects',
      value: assignedGroups.filter(g => g.status === 'In Progress').length.toString(),
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-400/20',
      route: '/guide/projects'
    },
    {
      title: 'Completed Projects',
      value: assignedGroups.filter(g => g.status === 'Completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/20',
      route: '/guide/evaluation'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Groups',
      description: 'View and manage assigned student groups',
      icon: Users2,
      route: '/guide/groups',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Project Approval',
      description: 'Review and approve project proposals',
      icon: FileText,
      route: '/guide/projects',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Provide Feedback',
      description: 'Give feedback and evaluations to students',
      icon: MessageSquare,
      route: '/guide/feedback',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Project Evaluation',
      description: 'Evaluate and grade student projects',
      icon: Award,
      route: '/guide/evaluation',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  //@ts-ignore
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/30 text-green-300 border-green-400/30';
      case 'In Progress':
        return 'bg-blue-500/30 text-blue-300 border-blue-400/30';
      case 'Under Review':
        return 'bg-orange-500/30 text-orange-300 border-orange-400/30';
      default:
        return 'bg-gray-500/30 text-gray-300 border-gray-400/30';
    }
  };

  //@ts-ignore
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/30 text-red-300 border-red-400/30';
      case 'medium':
        return 'bg-orange-500/30 text-orange-300 border-orange-400/30';
      case 'low':
        return 'bg-green-500/30 text-green-300 border-green-400/30';
      default:
        return 'bg-gray-500/30 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3CradialGradient id='a' cx='50%25' cy='50%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.05'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle fill='url(%23a)' cx='200' cy='200' r='100'/%3E%3Ccircle fill='url(%23a)' cx='800' cy='300' r='150'/%3E%3Ccircle fill='url(%23a)' cx='400' cy='700' r='120'/%3E%3C/svg%3E')] opacity-30 animate-pulse"></div>

      {/* Header */}
      <div className="sticky top-0 w-full bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <BookOpen size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Guide Dashboard
                </h1>
                <p className="text-purple-200/80 mt-1 text-sm">
                  {loading ? 'Loading...' : `Welcome back, ${guideProfile?.name || 'Guide'}! Ready to inspire today?`}
                </p>
                {useMockData && (
                  <p className="text-yellow-400/80 mt-1 text-xs">⚠️ Using mock data - API not available</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="group bg-white/10 text-white p-3 rounded-2xl border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                  <Bell size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {recentAnnouncements.length}
                  </span>
                </button>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden sm:block font-semibold">{guideProfile?.name || 'Guide'}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden">
                    <div className="p-4">
                      <div className="mb-4 pb-4 border-b border-white/20">
                        <p className="text-white font-semibold">{guideProfile?.name || 'Guide'}</p>
                        <p className="text-purple-200/70 text-sm">{guideProfile?.department || 'Guide'}</p>
                      </div>
                      <Link
                        to="/guide/profile"
                        className="flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                      >
                        <User size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => navigate('/guide/settings')}
                        className="w-full flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                      >
                        <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Settings</span>
                      </button>
                      <hr className="border-white/20 my-3" />
                      <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
                      >
                        <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-purple-400 animate-spin" />
              <p className="text-purple-200 text-lg">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-yellow-400" />
              <div>
                <h3 className="text-yellow-200 font-semibold">API Not Available</h3>
                <p className="text-yellow-200/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Only show when not loading */}
        {!loading && (
          <> {/* <--- Added missing fragment or parenthesis/brace for conditional rendering */}
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    onClick={() => navigate(stat.route)}
                    className="group bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:border-purple-400/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200/70 text-sm font-medium">{stat.title}</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon size={32} className={stat.color} />
                      </div>
                    </div>
                    <div className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => navigate(action.route)}
                      className="group bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:border-purple-400/50 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon size={28} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">{action.title}</h3>
                        <p className="text-purple-200/70 text-sm leading-relaxed">{action.description}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Assigned Groups */}
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <Users2 size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Assigned Groups
                    </h3>
                  </div>
                  <Link
                    to="/guide/groups"
                    className="group bg-white/10 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-300 text-purple-200 hover:text-white text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-6">
                  {assignedGroups.map((group) => (
                    <div key={group.id} className="group bg-white/10 p-6 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:bg-white/15">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-white text-lg group-hover:text-purple-200 transition-colors">{group.groupName}</h4>
                          <p className="text-purple-200/70 text-sm mt-1">{group.projectTitle}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(group.status)}`}>
                          {group.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-purple-200/70 font-medium">Progress:</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-white/10 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${group.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-bold">{group.progress}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-purple-200/70" />
                          <span className="text-purple-200/70">{group.members.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-200/70" />
                          <span className="text-purple-200/70">Next: {group.nextSeminar}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Announcements & Seminars */}
              <div className="space-y-6">
                {/* Announcements */}
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <Bell size={18} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Recent Announcements
                      </h3>
                    </div>
                    <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20 text-purple-200 text-xs font-medium">
                      View All
                    </span>
                  </div>

                  <div className="space-y-4">
                    {recentAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="group bg-white/10 p-4 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:bg-white/15">
                        <div className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                            announcement.priority === 'high' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                              announcement.priority === 'medium' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                                'bg-gradient-to-r from-green-400 to-emerald-400'
                            }`}></div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm group-hover:text-purple-200 transition-colors">{announcement.title}</h4>
                            <p className="text-purple-200/70 text-xs mt-2 leading-relaxed">{announcement.content}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Calendar size={12} className="text-purple-200/50" />
                              <p className="text-purple-200/50 text-xs">{announcement.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Project Progress Overview
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group text-center bg-white/10 p-6 rounded-3xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:bg-white/15">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <TrendingUp size={36} className="text-white" />
                  </div>
                  <h4 className="text-white font-bold mb-3 text-lg">Average Progress</h4>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {/* Handle division by zero for an empty array */}
                    {assignedGroups.length > 0 ? Math.round(assignedGroups.reduce((acc, group) => acc + group.progress, 0) / assignedGroups.length) : 0}%
                  </p>
                  <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${assignedGroups.length > 0 ? Math.round(assignedGroups.reduce((acc, group) => acc + group.progress, 0) / assignedGroups.length) : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="group text-center bg-white/10 p-6 rounded-3xl border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:bg-white/15">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <CheckCircle size={36} className="text-white" />
                  </div>
                  <h4 className="text-white font-bold mb-3 text-lg">On Track</h4>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {assignedGroups.filter(g => g.progress >= 70).length}
                  </p>
                  <p className="text-purple-200/70 text-sm mt-2">Groups performing well</p>
                </div>

                <div className="group text-center bg-white/10 p-6 rounded-3xl border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:bg-white/15">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <AlertCircle size={36} className="text-white" />
                  </div>
                  <h4 className="text-white font-bold mb-3 text-lg">Needs Attention</h4>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {assignedGroups.filter(g => g.progress < 50).length}
                  </p>
                  <p className="text-purple-200/70 text-sm mt-2">Requires guidance</p>
                </div>
              </div>
            </div>
          </> // <--- Added missing closing fragment or parenthesis/brace
        )}
      </div>
    </div>
  );
}