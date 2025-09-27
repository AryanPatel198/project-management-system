import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Search, UserRound, Mail, Phone, BookOpen, Trash2, Edit, UserCheck, X, Share, Users, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Input from '../../components/Input';
import { guideAPI } from '../../services/api';

/**
 * @typedef {Object} Guide
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} expertise
 * @property {string} status
 */

/**
 * @typedef {Object} Request
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} expertise
 * @property {string} submitted
 */

/**
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {string} guideId
 */

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
          <h2>Error Rendering Guide Management</h2>
          <p>{this.state.error?.message || 'An unknown error occurred'}</p>
          <p>Please check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function GuideManagement() {
  const navigate = useNavigate();
  /** @type {[Guide[], import('react').Dispatch<import('react').SetStateAction<Guide[]>>]} */
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  /** @type {[string | null, import('react').Dispatch<import('react').SetStateAction<string | null>>]} */
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedGuides = await guideAPI.getAllGuides();
        setGuides(fetchedGuides);
      } catch (error) {
        console.error('Error fetching guides:', error);
        setError('Failed to fetch guides. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);
  /** @type {[Request[], import('react').Dispatch<import('react').SetStateAction<Request[]>>]} */
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'req1', name: 'Dr. Priya Sharma', email: 'priya.s@example.com', phone: '9988776655', expertise: 'Java', submitted: '2025-07-20' },
    { id: 'req2', name: 'Mr. Rohan Verma', email: 'rohan.v@example.com', phone: '9911223344', expertise: 'Python', submitted: '2025-07-25' },
  ]);
  /** @type {[Group[], import('react').Dispatch<import('react').SetStateAction<Group[]>>]} */
  const [groups, setGroups] = useState([
    { id: 'gr1', name: 'Group Alpha', guideId: 'g1' },
    { id: 'gr2', name: 'Group Beta', guideId: 'g1' },
    { id: 'gr3', name: 'Group Gamma', guideId: 'g2' },
    { id: 'gr4', name: 'Group Delta', guideId: 'g1' },
    { id: 'gr5', name: 'Group Epsilon', guideId: 'g3' },
  ]);
  const availableExpertise = [
    'MERN Stack', 'AI/ML', 'Flutter', 'UI/UX', 'PHP', 'MySQL', 'Java', 'Spring Boot', 'Python', 'Data Science', 'Cloud Computing'
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [showEditGuideModal, setShowEditGuideModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [editingGuide, setEditingGuide] = useState(null);
  const [selectedGuideGroups, setSelectedGuideGroups] = useState([]);
  const [newGuide, setNewGuide] = useState({ name: '', email: '', phone: '', expertise: '' });
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', expertise: '', status: '' });

  useEffect(() => {
    console.log('GuideManagement component mounted');
    if (editingGuide) {
      setEditFormData({
        name: editingGuide.name,
        email: editingGuide.email,
        phone: editingGuide.phone,
        expertise: editingGuide.expertise,
        status: editingGuide.status,
      });
    }
  }, [editingGuide]);

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = pendingRequests.filter(request =>
    request.name.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
    request.expertise.toLowerCase().includes(requestSearchTerm.toLowerCase())
  );

  const handleBack = () => {
    console.log('Navigating back to /admin');
    navigate('/admin', { replace: true });
  };

  const handleAddGuide = () => {
    console.log('Opening Add Guide modal');
    setNewGuide({ name: '', email: '', phone: '', expertise: '' });
    setShowAddGuideModal(true);
  };

  const handleEditGuide = (guideId) => {
    console.log(`Editing guide: ${guideId}`);
    const guideToEdit = guides.find(guide => guide.id === guideId);
    if (guideToEdit) {
      setEditingGuide({ ...guideToEdit });
      setShowEditGuideModal(true);
    }
  };

  const handleDeleteGuide = (guideId) => {
    console.log(`Deleting guide: ${guideId}`);
    setGuides(guides.filter(guide => guide.id !== guideId));
  };

  const handleViewRequests = () => {
    console.log('Opening Pending Requests modal');
    setShowRequestsModal(true);
  };

  const handleViewGroups = (guideId) => {
    console.log(`Viewing groups for guide: ${guideId}`);
    const guideGroups = groups.filter(group => group.guideId === guideId);
    setSelectedGuideGroups(guideGroups);
    setShowGroupsModal(true);
  };

  const handleAcceptRequest = (requestId) => {
    console.log(`Accepting request: ${requestId}`);
    const acceptedRequest = pendingRequests.find(req => req.id === requestId);
    if (acceptedRequest) {
      setGuides([...guides, { ...acceptedRequest, status: 'Active', id: `g${guides.length + 1}` }]);
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId) => {
    console.log(`Rejecting request: ${requestId}`);
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
  };

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveNewGuide = (e) => {
    e.preventDefault();
    if (!newGuide.name || !newGuide.email || !newGuide.phone || !newGuide.expertise) {
      alert('Please fill all fields and select an expertise.');
      return;
    }
    console.log('Saving new guide:', newGuide);
    setGuides([...guides, { ...newGuide, id: `g${guides.length + 1}`, status: 'Active' }]);
    setShowAddGuideModal(false);
    setNewGuide({ name: '', email: '', phone: '', expertise: '' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.email || !editFormData.phone || !editFormData.expertise) {
      alert('Please fill all fields and select an expertise.');
      return;
    }
    console.log('Saving edited guide:', editFormData);
    setGuides(guides.map(guide => (guide.id === editingGuide.id ? { ...editingGuide, ...editFormData } : guide)));
    setShowEditGuideModal(false);
    setEditingGuide(null);
  };

  const handleShareAsPDF = () => {
    console.log('Generating PDF for guides');
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Guide List', 14, 20);

    const tableColumn = ["Name", "Email", "Phone", "Expertise", "Groups", "Status"];
    const tableRows = filteredGuides.map(guide => {
      const guideGroups = groups.filter(group => group.guideId === guide.id);
      const groupNames = guideGroups.map(group => group.name).join(', ');
      return [guide.name, guide.email, guide.phone, guide.expertise, groupNames, guide.status];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: {
        fillColor: [20, 184, 166],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      }
    });

    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);
    setPdfBlob(pdfOutput);
    setPdfUrl(pdfUrl);
    setShowShareModal(true);
  };

  const handleSavePDF = () => {
    console.log('Saving PDF');
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Guide List', 14, 20);

    const tableColumn = ["Name", "Email", "Phone", "Expertise", "Groups", "Status"];
    const tableRows = filteredGuides.map(guide => {
      const guideGroups = groups.filter(group => group.guideId === guide.id);
      const groupNames = guideGroups.map(group => group.name).join(', ');
      return [guide.name, guide.email, guide.phone, guide.expertise, groupNames, guide.status];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: {
        fillColor: [20, 184, 166],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      }
    });

    doc.save(`Guide-List-${new Date().toISOString().slice(0, 10)}.pdf`);
    setShowShareModal(false);
  };

  const handleSharePDF = async () => {
    console.log('Sharing PDF');
    if (navigator.share && pdfBlob) {
      try {
        await navigator.share({
          files: [new File([pdfBlob], `Guide-List-${new Date().toISOString().slice(0, 10)}.pdf`, { type: 'application/pdf' })],
          title: 'Guide List',
          text: 'List of guides from the Project Management System',
        });
        setShowShareModal(false);
      } catch (error) {
        console.error('Error sharing PDF:', error);
      }
    } else {
      navigator.clipboard.writeText(pdfUrl).then(() => {
        alert('PDF URL copied to clipboard! You can paste it to share.');
      });
      setShowShareModal(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-900 font-sans text-white">
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
            .guide-select option {
              color: white;
              background: rgba(0, 0, 0, 0.8);
            }
          `}
        </style>
        <div className="bg-particles" />
        <div className="sticky top-0 w-full bg-white/10 backdrop-blur-sm border-b border-white/30 shadow-lg z-10 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-white hover:text-cyan-400 transition duration-200"
                aria-label="Back to Dashboard"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                Manage Guides
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShareAsPDF}
                className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                aria-label="Share Guide List as PDF"
              >
                <Share size={20} className="mr-2" /> Share
              </button>
              <button
                onClick={handleViewRequests}
                className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                aria-label={`View Pending Requests (${pendingRequests.length})`}
              >
                <UserCheck size={20} className="mr-2" /> Requests ({pendingRequests.length})
              </button>
              <button
                onClick={handleAddGuide}
                className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                aria-label="Add New Guide"
              >
                <Plus size={20} className="mr-2" /> Add Guide
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30 animate-fade-in-up">
            {loading && (
              <div className="text-center text-white mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-2">Loading guides...</p>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center mb-4 p-3 bg-red-500/20 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="relative w-full md:w-1/2">
                <Input
                  id="search-guide"
                  type="text"
                  placeholder="Search guides by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Search guides by name"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 animate-icon-pulse" />
              </div>
            </div>

            {!loading && filteredGuides.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead>
                    <tr className="text-white/80">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Expertise</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Groups</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredGuides.map((guide) => (
                      <tr key={guide.id} className="hover:bg-white/5 transition duration-150 animate-fade-in-up">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserRound size={20} className="mr-2 text-teal-500" />
                            {guide.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail size={20} className="mr-2 text-white/60" />
                            {guide.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Phone size={20} className="mr-2 text-white/60" />
                            {guide.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BookOpen size={20} className="mr-2 text-white/60" />
                            {guide.expertise}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewGroups(guide.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleViewGroups(guide.id)}
                            className="flex items-center text-cyan-400 hover:text-cyan-300 transition duration-150"
                            aria-label={`View groups for ${guide.name}`}
                          >
                            <Users size={20} className="mr-2" />
                            {groups.filter(group => group.guideId === guide.id).length}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            guide.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {guide.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditGuide(guide.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEditGuide(guide.id)}
                            className="text-teal-300 hover:text-teal-200 mr-3"
                            aria-label={`Edit ${guide.name}`}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteGuide(guide.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDeleteGuide(guide.id)}
                            className="text-red-400 hover:text-red-300"
                            aria-label={`Delete ${guide.name}`}
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-white text-center p-4 flex items-center justify-center animate-fade-in-up">
                <UserRound size={24} className="mr-2 text-teal-500" /> No guides found. Click "Add Guide" to get started!
              </div>
            )}
          </div>
        </div>

        {/* Add New Guide Modal */}
        {showAddGuideModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/30 w-full max-w-md animate-fade-in-up relative">
              <button
                onClick={() => setShowAddGuideModal(false)}
                onKeyDown={(e) => e.key === 'Enter' && setShowAddGuideModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
                aria-label="Close Add Guide Modal"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Guide</h2>
              <form onSubmit={handleSaveNewGuide}>
                <Input
                  id="new-guide-name"
                  label="Guide Name"
                  type="text"
                  placeholder="Enter guide's name"
                  value={newGuide.name}
                  onChange={(e) => setNewGuide({ ...newGuide, name: e.target.value })}
                  className="bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Guide name"
                />
                <Input
                  id="new-guide-email"
                  label="Email"
                  type="email"
                  placeholder="Enter guide's email"
                  value={newGuide.email}
                  onChange={(e) => setNewGuide({ ...newGuide, email: e.target.value })}
                  className="bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Guide email"
                />
                <Input
                  id="new-guide-phone"
                  label="Phone"
                  type="tel"
                  placeholder="Enter guide's phone"
                  value={newGuide.phone}
                  onChange={(e) => setNewGuide({ ...newGuide, phone: e.target.value })}
                  className="bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Guide phone"
                />
                <label htmlFor="new-guide-expertise" className="block text-white/90 text-sm font-medium mb-2">Expertise</label>
                <div className="relative">
                  <select
                    id="new-guide-expertise"
                    className="guide-select w-full p-3 bg-gray-800 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-lg backdrop-blur-sm appearance-none cursor-pointer pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em'
                    }}
                    value={newGuide.expertise}
                    onChange={(e) => setNewGuide({ ...newGuide, expertise: e.target.value })}
                    aria-label="Select expertise"
                  >
                    <option value="">Select Expertise</option>
                    {availableExpertise.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddGuideModal(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setShowAddGuideModal(false)}
                    className="flex items-center bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-500 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label="Save Guide"
                  >
                    Save Guide
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pending Requests Modal */}
        {showRequestsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/30 w-full max-w-2xl animate-fade-in-up relative">
              <button
                onClick={() => setShowRequestsModal(false)}
                onKeyDown={(e) => e.key === 'Enter' && setShowRequestsModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
                aria-label="Close Pending Requests Modal"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Pending Guide Requests</h2>
              <div className="relative mb-6">
                <Input
                  id="search-request"
                  type="text"
                  placeholder="Search requests by name or expertise..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Search pending requests"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 animate-icon-pulse" />
              </div>
              {filteredRequests.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {filteredRequests.map(request => (
                    <div key={request.id} className="bg-white/5 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 animate-fade-in-up">
                      <div>
                        <p className="text-lg font-semibold text-white">{request.name}</p>
                        <p className="text-white/80 text-sm flex items-center"><Mail size={16} className="mr-2" />{request.email}</p>
                        <p className="text-white/80 text-sm flex items-center"><Phone size={16} className="mr-2" />{request.phone}</p>
                        <p className="text-white/80 text-sm flex items-center"><BookOpen size={16} className="mr-2" />Expertise: {request.expertise}</p>
                        <p className="text-white/80 text-sm flex items-center"><BookOpen size={16} className="mr-2" />Submitted: {request.submitted}</p>
                      </div>
                      <div className="flex space-x-3 mt-3 sm:mt-0">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAcceptRequest(request.id)}
                          className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                          aria-label={`Accept request for ${request.name}`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRejectRequest(request.id)}
                          className="flex items-center bg-red-500/80 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                          aria-label={`Reject request for ${request.name}`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white text-center p-4 flex items-center justify-center animate-fade-in-up">
                  <UserCheck size={24} className="mr-2 text-teal-500" /> No pending guide requests at this time.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Guide Modal */}
        {showEditGuideModal && editingGuide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/30 w-full max-w-md animate-fade-in-up relative">
              <button
                onClick={() => setShowEditGuideModal(false)}
                onKeyDown={(e) => e.key === 'Enter' && setShowEditGuideModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
                aria-label="Close Edit Guide Modal"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Guide</h2>
              <form onSubmit={handleSaveEdit}>
                <Input
                  id="edit-guide-name"
                  label="Guide Name"
                  type="text"
                  placeholder="Enter guide's name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Guide name"
                />
                <Input
                  id="edit-guide-email"
                  label="Email"
                  type="email"
                  placeholder="Enter guide's email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Guide email"
                />
                <Input
                  id="edit-guide-phone"
                  label="Phone"
                  type="tel"
                  placeholder="Enter guide's phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="bg-gray-800 text-white p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Guide phone"
                />
                <label htmlFor="edit-guide-expertise" className="block text-white/90 text-sm font-medium mb-2">Expertise</label>
                <div className="relative">
                  <select
                    id="edit-guide-expertise"
                    className="guide-select w-full p-3 bg-gray-800 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-lg backdrop-blur-sm appearance-none cursor-pointer pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em'
                    }}
                    value={editFormData.expertise}
                    onChange={(e) => setEditFormData({ ...editFormData, expertise: e.target.value })}
                    aria-label="Select expertise"
                  >
                    <option value="">Select Expertise</option>
                    {availableExpertise.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
                <label htmlFor="edit-guide-status" className="block text-white/90 text-sm font-medium mb-2">Status</label>
                <div className="relative">
                  <select
                    id="edit-guide-status"
                    className="guide-select w-full p-3 bg-gray-800 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-lg backdrop-blur-sm appearance-none cursor-pointer pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em'
                    }}
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    aria-label="Select status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditGuideModal(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setShowEditGuideModal(false)}
                    className="flex items-center bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-500 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                    aria-label="Save Changes"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Groups Modal */}
        {showGroupsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/30 w-full max-w-lg animate-fade-in-up relative">
              <button
                onClick={() => setShowGroupsModal(false)}
                onKeyDown={(e) => e.key === 'Enter' && setShowGroupsModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
                aria-label="Close Groups Modal"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Assigned Groups</h2>
              {selectedGuideGroups.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {selectedGuideGroups.map(group => (
                    <div key={group.id} className="bg-white/5 p-4 rounded-lg flex items-center gap-4 border border-white/20 animate-fade-in-up">
                      <Users size={24} className="text-teal-500" />
                      <p className="text-lg font-semibold text-white">{group.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white text-center p-4 flex items-center justify-center animate-fade-in-up">
                  <Users size={24} className="mr-2 text-teal-500" /> This guide is not currently assigned to any groups.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share/Save PDF Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/30 w-full max-w-md animate-fade-in-up relative">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  URL.revokeObjectURL(pdfUrl);
                }}
                onKeyDown={(e) => e.key === 'Enter' && setShowShareModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition duration-200"
                aria-label="Close Share PDF Modal"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Share Guide List</h2>
              <p className="text-white/80 mb-6 text-center">Choose an option to share or save the guide list PDF.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSavePDF}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePDF()}
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                  aria-label="Save PDF"
                >
                  <Download size={20} className="mr-2" /> Save PDF
                </button>
                <button
                  onClick={handleSharePDF}
                  onKeyDown={(e) => e.key === 'Enter' && handleSharePDF()}
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg animate-pulse-once"
                  aria-label="Share PDF"
                >
                  <Share size={20} className="mr-2" /> Share PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default GuideManagement;