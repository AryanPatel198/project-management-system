import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Plus, Edit, Trash, AlertCircle, MessageSquare } from 'lucide-react';

// Simple error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-4">
          <h2>Error Rendering Exam Schedules</h2>
          <p>{this.state.error?.message || 'An unknown error occurred'}</p>
          <p>Please check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function ExamScheduleManagement() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([
    { id: 1, course: 'BCA', type: 'Exam', description: 'Internal Exam 1', date: '2025-04-01', time: '10:00 AM' },
    { id: 2, course: 'MCA', type: 'Submission', description: 'Proposal Report Deadline', date: '2025-03-01', time: '' },
    { id: 3, course: 'BCA', type: 'Exam', description: 'Internal Exam 2', date: '2025-04-15', time: '02:00 PM' },
  ]);
  const [courseAnnouncements, setCourseAnnouncements] = useState([
    { id: 1, title: 'Exam Schedule Update', message: 'Internal exams rescheduled to April.', date: '2025-02-15', courses: ['BCA', 'MCA'] },
  ]);
  const [guideAnnouncements, setGuideAnnouncements] = useState([
    { id: 1, title: 'Project Evaluation Deadline', message: 'Submit evaluations by 10 Mar 2025.', date: '2025-03-01', guides: ['All'] },
    { id: 2, title: 'Faculty Meeting', message: 'Attend meeting on 15 Mar 2025 at 3 PM.', date: '2025-03-05', guides: ['Dr. Smith', 'Prof. Jones'] },
  ]);
  const [filterCourse, setFilterCourse] = useState('All');
  const [activeTab, setActiveTab] = useState('schedules');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCourseAnnouncementModalOpen, setIsCourseAnnouncementModalOpen] = useState(false);
  const [isGuideAnnouncementModalOpen, setIsGuideAnnouncementModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [currentCourseAnnouncement, setCurrentCourseAnnouncement] = useState(null);
  const [currentGuideAnnouncement, setCurrentGuideAnnouncement] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ course: 'BCA', type: 'Exam', description: '', date: '', time: '' });
  const [courseAnnouncementForm, setCourseAnnouncementForm] = useState({ title: '', message: '', date: '', courses: [] });
  const [guideAnnouncementForm, setGuideAnnouncementForm] = useState({ title: '', message: '', date: '', guides: [] });
  const [guides] = useState(['All', 'Dr. Smith', 'Prof. Jones', 'Dr. Patel']);

  useEffect(() => {
    console.log('ExamScheduleManagement component mounted');
    // TODO: Fetch schedules, course announcements, and guide announcements from Firebase/MongoDB
  }, []);

  const handleTabChange = (tab) => {
    console.log(`Tab clicked: ${tab}`);
    setActiveTab(tab);
  };

  const handleKeyDown = (e, tab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      console.log(`Tab activated via keyboard: ${tab}`);
      setActiveTab(tab);
    }
  };

  const handleAddEditSchedule = () => {
    if (!scheduleForm.course || !scheduleForm.type || !scheduleForm.description || !scheduleForm.date) {
      alert('Please fill all required fields');
      return;
    }
    if (currentSchedule) {
      setSchedules(schedules.map(s => (s.id === currentSchedule.id ? { ...scheduleForm, id: s.id } : s)));
    } else {
      setSchedules([...schedules, { ...scheduleForm, id: schedules.length + 1 }]);
    }
    setIsScheduleModalOpen(false);
    setScheduleForm({ course: 'BCA', type: 'Exam', description: '', date: '', time: '' });
    setCurrentSchedule(null);
    // TODO: Save to Firebase/MongoDB
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
    // TODO: Delete from Firebase/MongoDB
  };

  const handleAddEditCourseAnnouncement = () => {
    if (!courseAnnouncementForm.title || !courseAnnouncementForm.message || !courseAnnouncementForm.date || courseAnnouncementForm.courses.length === 0) {
      alert('Please fill all required fields');
      return;
    }
    if (currentCourseAnnouncement) {
      setCourseAnnouncements(courseAnnouncements.map(a => (a.id === currentCourseAnnouncement.id ? { ...courseAnnouncementForm, id: a.id } : a)));
    } else {
      setCourseAnnouncements([...courseAnnouncements, { ...courseAnnouncementForm, id: courseAnnouncements.length + 1 }]);
    }
    setIsCourseAnnouncementModalOpen(false);
    setCourseAnnouncementForm({ title: '', message: '', date: '', courses: [] });
    setCurrentCourseAnnouncement(null);
    // TODO: Send course announcement via Firebase/MongoDB
  };

  const handleDeleteCourseAnnouncement = (id) => {
    setCourseAnnouncements(courseAnnouncements.filter(a => a.id !== id));
    // TODO: Delete from Firebase/MongoDB
  };

  const handleAddEditGuideAnnouncement = () => {
    if (!guideAnnouncementForm.title || !guideAnnouncementForm.message || !guideAnnouncementForm.date || guideAnnouncementForm.guides.length === 0) {
      alert('Please fill all required fields');
      return;
    }
    if (currentGuideAnnouncement) {
      setGuideAnnouncements(guideAnnouncements.map(a => (a.id === currentGuideAnnouncement.id ? { ...guideAnnouncementForm, id: a.id } : a)));
    } else {
      setGuideAnnouncements([...guideAnnouncements, { ...guideAnnouncementForm, id: guideAnnouncements.length + 1 }]);
    }
    setIsGuideAnnouncementModalOpen(false);
    setGuideAnnouncementForm({ title: '', message: '', date: '', guides: [] });
    setCurrentGuideAnnouncement(null);
    // TODO: Send guide announcement via Firebase/MongoDB
  };

  const handleDeleteGuideAnnouncement = (id) => {
    setGuideAnnouncements(guideAnnouncements.filter(a => a.id !== id));
    // TODO: Delete from Firebase/MongoDB
  };

  const openScheduleModal = (schedule = null) => {
    setCurrentSchedule(schedule);
    setScheduleForm(schedule || { course: 'BCA', type: 'Exam', description: '', date: '', time: '' });
    setIsScheduleModalOpen(true);
  };

  const openCourseAnnouncementModal = (announcement = null) => {
    setCurrentCourseAnnouncement(announcement);
    setCourseAnnouncementForm(announcement || { title: '', message: '', date: '', courses: [] });
    setIsCourseAnnouncementModalOpen(true);
  };

  const openGuideAnnouncementModal = (announcement = null) => {
    setCurrentGuideAnnouncement(announcement);
    setGuideAnnouncementForm(announcement || { title: '', message: '', date: '', guides: [] });
    setIsGuideAnnouncementModalOpen(true);
  };

  const filteredSchedules = filterCourse === 'All' ? schedules : schedules.filter(s => s.course === filterCourse);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-900 font-sans">
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
            .tab-button {
              position: relative;
              z-index: 10;
              pointer-events: auto;
            }
          `}
        </style>
        <div className="bg-particles" />
        <div className="sticky top-0 w-full bg-white/10 backdrop-blur-sm border-b border-white/30 shadow-lg z-10 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin')}
                className="mr-4 text-white hover:text-cyan-400 transition duration-200"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                Exam Schedules & Announcements
              </h1>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6">
          {/* Tabs */}
          <div className="flex border-b border-white/30 mb-6 space-x-2">
            <button
              onClick={() => handleTabChange('schedules')}
              onKeyDown={(e) => handleKeyDown(e, 'schedules')}
              className={`tab-button px-4 py-2 font-semibold text-white cursor-pointer ${activeTab === 'schedules' ? 'bg-teal-500' : 'bg-gray-800'} rounded-t-lg transition duration-200 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500`}
              aria-label="View Schedules"
              data-testid="tab-schedules"
            >
              Schedules
            </button>
            <button
              onClick={() => handleTabChange('courseAnnouncements')}
              onKeyDown={(e) => handleKeyDown(e, 'courseAnnouncements')}
              className={`tab-button px-4 py-2 font-semibold text-white cursor-pointer ${activeTab === 'courseAnnouncements' ? 'bg-teal-500' : 'bg-gray-800'} rounded-t-lg transition duration-200 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500`}
              aria-label="View Course Announcements"
              data-testid="tab-courseAnnouncements"
            >
              Course Announcements
            </button>
            <button
              onClick={() => handleTabChange('guideAnnouncements')}
              onKeyDown={(e) => handleKeyDown(e, 'guideAnnouncements')}
              className={`tab-button px-4 py-2 font-semibold text-white cursor-pointer ${activeTab === 'guideAnnouncements' ? 'bg-teal-500' : 'bg-gray-800'} rounded-t-lg transition duration-200 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500`}
              aria-label="View Guide Announcements"
              data-testid="tab-guideAnnouncements"
            >
              Guide Announcements
            </button>
          </div>

          {/* Schedules Tab */}
          {activeTab === 'schedules' && (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Schedules</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                    aria-label="Filter by course"
                  >
                    <option value="All">All Courses</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                  <button
                    onClick={() => openScheduleModal()}
                    className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label="Add New Schedule"
                  >
                    <Plus size={20} className="mr-2" /> Add Schedule
                  </button>
                </div>
              </div>
              {filteredSchedules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/30">
                        <th className="p-2 text-left">Course</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Time</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchedules.map((schedule) => (
                        <tr key={schedule.id} className="border-b border-white/20 hover:bg-white/10 animate-fade-in-up">
                          <td className="p-2">{schedule.course}</td>
                          <td className="p-2">{schedule.type}</td>
                          <td className="p-2">{schedule.description}</td>
                          <td className="p-2">{schedule.date}</td>
                          <td className="p-2">{schedule.time || '-'}</td>
                          <td className="p-2 flex space-x-2">
                            <button
                              onClick={() => openScheduleModal(schedule)}
                              className="text-cyan-400 hover:text-cyan-300"
                              aria-label={`Edit ${schedule.description}`}
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-400 hover:text-red-300"
                              aria-label={`Delete ${schedule.description}`}
                            >
                              <Trash size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-white text-center p-4 flex items-center justify-center">
                  <AlertCircle size={24} className="mr-2" /> No schedules available for {filterCourse}.
                </div>
              )}
            </div>
          )}

          {/* Course Announcements Tab */}
          {activeTab === 'courseAnnouncements' && (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Course Announcements</h2>
                <button
                  onClick={() => openCourseAnnouncementModal()}
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                  aria-label="Add New Course Announcement"
                >
                  <Plus size={20} className="mr-2" /> Add Announcement
                </button>
              </div>
              {courseAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {courseAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="bg-white/5 p-4 rounded-lg border border-white/20 animate-fade-in-up">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                          <p className="text-white/90">{announcement.message}</p>
                          <p className="text-sm text-white/70">Date: {announcement.date}</p>
                          <p className="text-sm text-white/70">Courses: {announcement.courses.join(', ')}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openCourseAnnouncementModal(announcement)}
                            className="text-cyan-400 hover:text-cyan-300"
                            aria-label={`Edit ${announcement.title}`}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourseAnnouncement(announcement.id)}
                            className="text-red-400 hover:text-red-300"
                            aria-label={`Delete ${announcement.title}`}
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white text-center p-4 flex items-center justify-center">
                  <AlertCircle size={24} className="mr-2" /> No course announcements available.
                </div>
              )}
            </div>
          )}

          {/* Guide Announcements Tab */}
          {activeTab === 'guideAnnouncements' && (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Guide Announcements</h2>
                <button
                  onClick={() => openGuideAnnouncementModal()}
                  className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                  aria-label="Add New Guide Announcement"
                >
                  <Plus size={20} className="mr-2" /> Add Announcement
                </button>
              </div>
              {guideAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {guideAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="bg-white/5 p-4 rounded-lg border border-white/20 animate-fade-in-up">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                          <p className="text-white/90">{announcement.message}</p>
                          <p className="text-sm text-white/70">Date: {announcement.date}</p>
                          <p className="text-sm text-white/70">Guides: {announcement.guides.join(', ')}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openGuideAnnouncementModal(announcement)}
                            className="text-teal-300 hover:text-teal-200"
                            aria-label={`Edit ${announcement.title}`}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteGuideAnnouncement(announcement.id)}
                            className="text-red-400 hover:text-red-300"
                            aria-label={`Delete ${announcement.title}`}
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white text-center p-4 flex items-center justify-center">
                  <AlertCircle size={24} className="mr-2" /> No guide announcements available.
                </div>
              )}
            </div>
          )}

          {/* Schedule Modal */}
          {isScheduleModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 w-full max-w-md animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-4">{currentSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 mb-1">Course</label>
                    <select
                      value={scheduleForm.course}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, course: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      aria-label="Select course"
                    >
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Type</label>
                    <select
                      value={scheduleForm.type}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      aria-label="Select type"
                    >
                      <option value="Exam">Exam</option>
                      <option value="Submission">Submission</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Description</label>
                    <input
                      type="text"
                      value={scheduleForm.description}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      placeholder="e.g., Internal Exam 1"
                      aria-label="Schedule description"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      aria-label="Schedule date"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Time (optional)</label>
                    <input
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      aria-label="Schedule time"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEditSchedule}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label={currentSchedule ? 'Save Schedule' : 'Add Schedule'}
                  >
                    {currentSchedule ? 'Save' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Course Announcement Modal */}
          {isCourseAnnouncementModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 w-full max-w-md animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-4">{currentCourseAnnouncement ? 'Edit Course Announcement' : 'Add Course Announcement'}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 mb-1">Title</label>
                    <input
                      type="text"
                      value={courseAnnouncementForm.title}
                      onChange={(e) => setCourseAnnouncementForm({ ...courseAnnouncementForm, title: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      placeholder="e.g., Exam Schedule Update"
                      aria-label="Course announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Message</label>
                    <textarea
                      value={courseAnnouncementForm.message}
                      onChange={(e) => setCourseAnnouncementForm({ ...courseAnnouncementForm, message: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      placeholder="e.g., Internal exams rescheduled."
                      rows="4"
                      aria-label="Course announcement message"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Date</label>
                    <input
                      type="date"
                      value={courseAnnouncementForm.date}
                      onChange={(e) => setCourseAnnouncementForm({ ...courseAnnouncementForm, date: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      aria-label="Course announcement date"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Courses</label>
                    <div className="flex space-x-2">
                      {['BCA', 'MCA'].map((course) => (
                        <label key={course} className="flex items-center text-white">
                          <input
                            type="checkbox"
                            checked={courseAnnouncementForm.courses.includes(course)}
                            onChange={(e) => {
                              const courses = e.target.checked
                                ? [...courseAnnouncementForm.courses, course]
                                : courseAnnouncementForm.courses.filter(c => c !== course);
                              setCourseAnnouncementForm({ ...courseAnnouncementForm, courses });
                            }}
                            className="mr-2"
                            aria-label={`Select ${course}`}
                          />
                          {course}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setIsCourseAnnouncementModalOpen(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEditCourseAnnouncement}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label={currentCourseAnnouncement ? 'Save Course Announcement' : 'Send Course Announcement'}
                  >
                    {currentCourseAnnouncement ? 'Save' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Guide Announcement Modal */}
          {isGuideAnnouncementModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 w-full max-w-md animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-4">{currentGuideAnnouncement ? 'Edit Guide Announcement' : 'Add Guide Announcement'}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 mb-1">Title</label>
                    <input
                      type="text"
                      value={guideAnnouncementForm.title}
                      onChange={(e) => setGuideAnnouncementForm({ ...guideAnnouncementForm, title: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      placeholder="e.g., Project Evaluation Deadline"
                      aria-label="Guide announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Message</label>
                    <textarea
                      value={guideAnnouncementForm.message}
                      onChange={(e) => setGuideAnnouncementForm({ ...guideAnnouncementForm, message: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      placeholder="e.g., Submit evaluations by 10 Mar."
                      rows="4"
                      aria-label="Guide announcement message"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Date</label>
                    <input
                      type="date"
                      value={guideAnnouncementForm.date}
                      onChange={(e) => setGuideAnnouncementForm({ ...guideAnnouncementForm, date: e.target.value })}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg border border-white/30"
                      aria-label="Guide announcement date"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-1">Guides</label>
                    <div className="flex flex-wrap gap-2">
                      {guides.map((guide) => (
                        <label key={guide} className="flex items-center text-white">
                          <input
                            type="checkbox"
                            checked={guideAnnouncementForm.guides.includes(guide)}
                            onChange={(e) => {
                              const guidesList = e.target.checked
                                ? [...guideAnnouncementForm.guides, guide]
                                : guideAnnouncementForm.guides.filter(g => g !== guide);
                              setGuideAnnouncementForm({ ...guideAnnouncementForm, guides: guidesList });
                            }}
                            className="mr-2"
                            aria-label={`Select ${guide}`}
                          />
                          {guide}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setIsGuideAnnouncementModalOpen(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEditGuideAnnouncement}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label={currentGuideAnnouncement ? 'Save Guide Announcement' : 'Send Guide Announcement'}
                  >
                    {currentGuideAnnouncement ? 'Save' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ExamScheduleManagement;