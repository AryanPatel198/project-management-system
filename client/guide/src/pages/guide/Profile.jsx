import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, User, Key, Mail, Camera, LogOut, Upload, Phone } from 'lucide-react';
import { currentGuide } from '../../data/mockData';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    expertise: '',
    phone: '',
    profileImage: null,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize from mock/current user
  useEffect(() => {
    const user = currentGuide;
    setProfile(p => ({
      ...p,
      name: user.name || '',
      email: user.email || '',
      department: user.department || '',
      expertise: user.expertise || '',
      phone: user.phone || '',
    }));
  }, []);

  const handleProfileSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Profile updated (demo)');
      setTimeout(() => setMessage(''), 2000);
    }, 600);
  };

  const handlePasswordSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('Passwords do not match!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    if (passwords.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Password changed (demo)');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 2000);
    }, 600);
  };

  // @ts-ignore
  const handleImageUpload = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
       reader.onload = (e) => {
        // @ts-ignore
        if (e.target && e.target.result) {
          // @ts-ignore
          setProfile((prev) => ({ ...prev, profileImage: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/guide/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <div className="sticky top-0 w-full bg-white/20 backdrop-blur-md border-b border-white/30 shadow-glow z-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/guide/dashboard')}
            className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition border border-white/30"
          >
            <ChevronLeft size={18} className="mr-2" /> Back to Dashboard
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
            Guide <span className="text-teal-400">Profile</span>
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/guide/dashboard')}
              className="bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500/30 text-white py-2 px-4 rounded-lg border border-red-400/30 hover:bg-red-500/40 transition"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-teal-400 font-semibold px-6 py-3 rounded-lg border border-white/30 z-50">
          {message}
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-glow border border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User size={24} className="text-white mr-3" /> Profile Photo
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-white/60" />
                  )}
                </div>
                // @ts-ignore
                <button
                  // @ts-ignore
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full border-2 border-white/30 hover:scale-110 transition"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              // @ts-ignore
              <button
                // @ts-ignore
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center bg-white/10 text-white py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition"
              >
                <Upload size={18} className="mr-2" /> Upload Photo
              </button>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-glow border border-white/30 lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User size={24} className="text-white mr-3" /> Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Email Address</label>
                <div className="flex items-center bg-white/10 rounded-lg border border-white/20 px-3">
                  <Mail size={18} className="text-white/80 mr-2" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="w-full py-3 bg-transparent text-white outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your department"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Expertise</label>
                <input
                  type="text"
                  value={profile.expertise}
                  onChange={(e) => setProfile((p) => ({ ...p, expertise: e.target.value }))}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your expertise"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-white mb-2">Phone Number</label>
                <div className="flex items-center bg-white/10 rounded-lg border border-white/20 px-3">
                  <Phone size={18} className="text-white/80 mr-2" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full py-3 bg-transparent text-white outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition border border-white/30 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-glow border border-white/30 lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Key size={24} className="text-white mr-3" /> Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-white mb-2">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-white mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                className="bg-gray-600/80 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition border border-white/30"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition border border-white/30 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
