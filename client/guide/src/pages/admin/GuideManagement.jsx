// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Users, User, BookOpen, Smartphone, Code, Hash, Trash2, Edit, X, ChevronDown, Plus, ArrowRight, ArrowLeft, Share, Download, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Mock Data
const initialGuides = [
    { id: 'g1', name: 'Patel Kartik', email: 'kartik21@college.edu', phone: '9876543210', expertise: 'MERN Stack', status: 'Active' },
    { id: 'g2', name: 'Prof. Jaymin patel', email: 'jaymin08@college.edu', phone: '9123456789', expertise: 'Flutter', status: 'Active' },
    { id: 'g3', name: 'Shah timir', email: 'shahtimir29@college.edu', phone: '9988776655', expertise: 'PHP', status: 'Inactive' },
];

const initialGroups = [
    { id: 'gr1', name: 'Group Alpha', guideId: 'g1' },
    { id: 'gr2', name: 'Group Beta', guideId: 'g1' },
    { id: 'gr3', name: 'Group Gamma', guideId: 'g2' },
];

const initialPendingRequests = [
    { id: 'req1', name: 'Dr. Priya Sharma', email: 'priya.s@example.com', phone: '9988776655', expertise: 'Java', submitted: '2025-07-20' },
];

const availableExpertise = ['MERN Stack', 'AI/ML', 'Flutter', 'UI/UX', 'PHP', 'MySQL', 'Java', 'Spring Boot', 'Python', 'Data Science', 'Cloud Computing'];

// Main Component
function GuideManagement() {
    const navigate = useNavigate();
    const [guides, setGuides] = useState(initialGuides);
    const [groups, setGroups] = useState(initialGroups);
    const [pendingRequests, setPendingRequests] = useState(initialPendingRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);

    const filteredGuides = guides.filter(guide =>
        guide.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveNewGuide = (newGuideData) => {
        setGuides([...guides, { ...newGuideData, id: `g${guides.length + 1}`, status: 'Active' }]);
        setShowAddModal(false);
    };

    const handleSaveEditGuide = (editedGuideData) => {
        setGuides(guides.map(guide => (guide.id === editingGuide.id ? { ...editingGuide, ...editedGuideData } : guide)));
        setShowEditModal(false);
        setEditingGuide(null);
    };
    
    const handleDeleteGuide = (guideId) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            setGuides(guides.filter(guide => guide.id !== guideId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold">Guide Management</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowRequestsModal(true)} className="flex items-center gap-2 bg-blue-500/80 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition">
                            <UserCheck size={18} /> Requests ({pendingRequests.length})
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-teal-500/80 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-600 transition">
                            <Plus size={18} /> Add Guide
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search guides..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 p-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>

                {/* Guide Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuides.map(guide => (
                        <GuideCard key={guide.id} guide={guide} groups={groups.filter(g => g.guideId === guide.id)} onEdit={setEditingGuide} onDelete={handleDeleteGuide} onShowEditModal={setShowEditModal} />
                    ))}
                </div>
            </div>

            {/* Modals */}
            {showAddModal && <GuideModal onClose={() => setShowAddModal(false)} onSave={handleSaveNewGuide} expertiseOptions={availableExpertise} />}
            {showEditModal && editingGuide && <GuideModal guide={editingGuide} onClose={() => setShowEditModal(false)} onSave={handleSaveEditGuide} expertiseOptions={availableExpertise} />}
            {showRequestsModal && <RequestsModal requests={pendingRequests} onClose={() => setShowRequestsModal(false)} setRequests={setPendingRequests} setGuides={setGuides} guides={guides} />} 
        </div>
    );
}

// GuideCard Component
const GuideCard = ({ guide, groups, onEdit, onDelete, onShowEditModal }) => {
    return (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{guide.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${guide.status === 'Active' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                        {guide.status}
                    </span>
                </div>
                <div className="space-y-3 text-sm text-white/80">
                    <p className="flex items-center"><Mail size={14} className="mr-2" /> {guide.email}</p>
                    <p className="flex items-center"><Phone size={14} className="mr-2" /> {guide.phone}</p>
                    <p className="flex items-center"><BookOpen size={14} className="mr-2" /> {guide.expertise}</p>
                    <p className="flex items-center"><Users size={14} className="mr-2" /> {groups.length} Groups</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => { onEdit(guide); onShowEditModal(true); }} className="p-2 text-white/80 hover:text-white transition-colors"><Edit size={18} /></button>
                <button onClick={() => onDelete(guide.id)} className="p-2 text-red-400 hover:text-red-300 transition-colors"><Trash2 size={18} /></button>
            </div>
        </div>
    );
};

// GuideModal Component (for Add/Edit)
const GuideModal = ({ guide, onClose, onSave, expertiseOptions }) => {
    const [formData, setFormData] = useState({
        name: guide?.name || '',
        email: guide?.email || '',
        phone: guide?.phone || '',
        expertise: guide?.expertise || '',
        status: guide?.status || 'Active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">{guide ? 'Edit Guide' : 'Add New Guide'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Expertise</label>
                        <select value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} className="w-full bg-white/10 p-3 rounded-lg border border-white/20">
                            <option value="">Select Expertise</option>
                            {expertiseOptions.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                        </select>
                    </div>
                    {guide && (
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white/10 p-3 rounded-lg border border-white/20">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg text-white/80 bg-white/10 hover:bg-white/20">Cancel</button>
                        <button type="submit" className="py-2 px-4 rounded-lg bg-teal-500 hover:bg-teal-600 font-semibold">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// RequestsModal Component
const RequestsModal = ({ requests, onClose, setRequests, setGuides, guides }) => {
    const handleAccept = (request) => {
        setGuides([...guides, { ...request, id: `g${guides.length + 1}`, status: 'Active' }]);
        setRequests(requests.filter(r => r.id !== request.id));
    };

    const handleReject = (requestId) => {
        setRequests(requests.filter(r => r.id !== requestId));
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">Pending Guide Requests</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {requests.length > 0 ? requests.map(req => (
                        <div key={req.id} className="bg-white/10 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{req.name}</p>
                                <p className="text-sm text-white/70">{req.email} - {req.expertise}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleAccept(req)} className="py-1 px-3 rounded bg-green-500/80 hover:bg-green-600 text-xs font-semibold">Accept</button>
                                <button onClick={() => handleReject(req.id)} className="py-1 px-3 rounded bg-red-500/80 hover:bg-red-600 text-xs font-semibold">Reject</button>
                            </div>
                        </div>
                    )) : <p className="text-center text-white/70">No pending requests.</p>}
                </div>
            </div>
        </div>
    );
};

export default GuideManagement;
