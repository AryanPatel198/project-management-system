import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Users,
  User,
  BookOpen,
  Smartphone,
  Code,
  Hash,
  Trash2,
  Edit,
  X,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Reusable Dropdown component for filters and student selection
const FilterDropdown = ({
  title,
  options,
  selected,
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 bg-white/10 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-white/20 shadow-neumorphic border border-white/20 backdrop-blur-sm w-40 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300b8d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1.5em",
        }}
        aria-label={`Select ${title}`}
      >
        <span>{selected || title}</span>
        <ChevronDown
          size={20}
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          } text-accent-teal`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-12 left-0 w-48 bg-white/10 rounded-lg shadow-neumorphic border border-white/20 z-10 transition-all duration-200 backdrop-blur-sm animate-fade-in">
          <ul className="py-2">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                onKeyPress={(e) => e.key === "Enter" && handleSelect(option)}
                className={`px-4 py-2 cursor-pointer transition-colors duration-200 text-white ${
                  selected === option
                    ? "bg-accent-teal font-bold"
                    : "hover:bg-accent-teal/50"
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
  const [groups, setGroups] = useState([]);
  const [guides, setGuides] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showChangeGuideModal, setShowChangeGuideModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [newGuide, setNewGuide] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Removed selectedClassFilter and replaced it with a dummy value, as the API doesn't support it
  // const [selectedClassFilter, setSelectedClassFilter] = useState("All");
  const [selectedYearFilter, setSelectedYearFilter] = useState(
    new Date().getFullYear().toString()
  );
  const [availableStudents, setAvailableStudents] = useState([]);

  // Replace with your actual admin token retrieval logic
  const adminToken = localStorage.getItem("token");

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch all initial data and groups with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${adminToken}` };

        // Fetch guides
        const guidesResponse = await axios.get(
          `${API_BASE_URL}/active-guides`,
          { headers }
        );
        setGuides(
          Array.isArray(guidesResponse.data) ? guidesResponse.data : []
        );

        // Fetch groups based on selected filters (API only supports year filter)
        const groupsResponse = await axios.get(`${API_BASE_URL}/get-groups`, {
          headers,
          params: {
            // Only send year if filter is not "All Years"
            year:
              selectedYearFilter !== "All Years"
                ? Number(selectedYearFilter)
                : undefined,
          },
        });

        // Handle the response data format (assuming it's an array or wrapped)
        if (Array.isArray(groupsResponse.data)) {
          setGroups(groupsResponse.data);
        } else if (
          groupsResponse.data?.success &&
          Array.isArray(groupsResponse.data.data)
        ) {
          // Handle case where API wraps data in { success: true, data: [...] }
          setGroups(groupsResponse.data.data);
        } else {
          setGroups([]);
          console.warn(
            "No groups found or server returned unexpected response format."
          );
        }

        // Fetch divisions (assuming this endpoint is correct)
        const divisionsResponse = await axios.get(
          `${API_BASE_URL}/get-divisions`,
          {
            headers,
          }
        );
        setDivisions(divisionsResponse.data.data);
      } catch (error) {
        setErrorMessage("Failed to fetch data. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedYearFilter, adminToken, API_BASE_URL]); // Removed selectedClassFilter from dependency array

  // Filter options
  // NOTE: The class/course filter array is simplified since the current backend API
  // only supports filtering by year (`getGroupsByYear`).
  // const allClassNames = ["All"];
  const allYears = [
    "All Years",
    ...new Set(divisions.map((division) => division.year.toString())),
  ]
    .sort()
    .reverse();

  // Get active guides
  const activeGuides = guides.filter(
    (guide) => guide.status === "approved" && guide.isActive === true
  );

  // Get available students for a group
  const getAvailableStudents = async () => {
    if (!selectedGroup) return [];
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      // NOTE: This call might still need adjustment if the backend needs course/semester info for empty groups.
      // The current implementation attempts to use the group details for filtering.
      const response = await axios.get(
        `${API_BASE_URL}/get-students-by-group/${selectedGroup._id}`,
        // GET /api/admin/get-students-by-group/:id
        // router.get(":id", protectAdmin, getStudentsByGroup);
        { headers }
      );
      return response.data;
    } catch (error) {
      setErrorMessage("Failed to fetch available students.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error fetching available students:", error);
      console.error("Error response:", error.response?.data);
      return [];
    }
  };

  // Handlers
  const handleBack = () => {
    navigate("/admin/dashboard", { replace: true });
  };

  const handleViewDetails = async (group) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get(
        `${API_BASE_URL}/get-group/${group._id}`,
        {
          headers,
        }
      );
      setSelectedGroup(response.data.data);
    } catch (error) {
      setErrorMessage("Failed to fetch group details.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error fetching group details:", error);
    }
  };

  const handleBackToList = () => {
    setSelectedGroup(null);
  };

  const getGuideDetails = (guideName) => {
    return guides.find((guide) => guide.name === guideName) || {};
  };

  const openChangeGuideModal = () => {
    setNewGuide(selectedGroup.guide.name);
    setShowChangeGuideModal(true);
  };

  const handleSaveGuideChange = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const guideId = guides.find((guide) => guide.name === newGuide)?._id;
      await axios.put(
        `${API_BASE_URL}/groups/${selectedGroup._id}`,
        { guide: guideId },
        { headers }
      );
      setGroups(
        groups.map((group) =>
          group._id === selectedGroup._id
            ? { ...group, guide: { name: newGuide } }
            : group
        )
      );
      setSelectedGroup((prev) => ({ ...prev, guide: { name: newGuide } }));
      setShowChangeGuideModal(false);
      setSuccessMessage(
        `Guide for ${selectedGroup.name} changed successfully!`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to change guide.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error changing guide:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const deletedGroupName = selectedGroup.name;
      await axios.delete(`${API_BASE_URL}/groups/${selectedGroup._id}`, {
        headers,
      });
      setGroups(groups.filter((group) => group._id !== selectedGroup._id));
      setSelectedGroup(null);
      setShowDeleteModal(false);
      setSuccessMessage(`Group "${deletedGroupName}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete group.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error deleting group:", error);
    }
  };

  const handleAddStudent = async () => {
    if (selectedGroup.members.length >= 4) {
      setSuccessMessage("Cannot add more than 4 students to a group!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    if (!newStudent) {
      setSuccessMessage("Please select a student to add!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const studentData = availableStudents.find(
        // Use availableStudents state
        (s) => s.enrollmentNumber === newStudent
      );
      if (!studentData) {
        setSuccessMessage("Selected student is not available!");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }
      const newMember = {
        name: studentData.name,
        enrollment: studentData.enrollmentNumber,
        className: studentData.className,
      };
      const updatedMembers = [...selectedGroup.members, newMember];
      await axios.put(
        `${API_BASE_URL}/groups/${selectedGroup._id}`,
        { members: updatedMembers },
        { headers }
      );
      setGroups(
        groups.map((group) =>
          group._id === selectedGroup._id
            ? { ...group, members: updatedMembers }
            : group
        )
      );
      setSelectedGroup((prev) => ({ ...prev, members: updatedMembers }));
      setShowAddStudentModal(false);
      setNewStudent("");
      setSuccessMessage(
        `Student ${studentData.name} added to ${selectedGroup.name}!`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to add student.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error adding student:", error);
    }
  };

  const handleDeleteStudent = async () => {
    if (selectedGroup.members.length <= 3) {
      setSuccessMessage("Cannot remove student: Minimum 3 students required!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowDeleteStudentModal(false);
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const updatedMembers = selectedGroup.members.filter(
        (m) => m.enrollment !== studentToDelete.enrollment
      );
      await axios.put(
        `${API_BASE_URL}/groups/${selectedGroup._id}`,
        { members: updatedMembers },
        { headers }
      );
      setGroups(
        groups.map((group) =>
          group._id === selectedGroup._id
            ? { ...group, members: updatedMembers }
            : group
        )
      );
      setSelectedGroup((prev) => ({ ...prev, members: updatedMembers }));
      setShowDeleteStudentModal(false);
      setSuccessMessage(
        `Student ${studentToDelete.name} removed from ${selectedGroup.name}!`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to remove student.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error removing student:", error);
    }
  };

  // Fetch available students when modal opens
  const handleOpenAddStudentModal = async () => {
    setShowAddStudentModal(true);
    setNewStudent("");
    setAvailableStudents([]);

    if (selectedGroup) {
      try {
        // const headers = { Authorization: `Bearer ${adminToken}` };

        // This is a complex logic that might be simplified if the backend
        // can determine context from selectedGroup._id. Assuming the backend handles
        // finding the appropriate students for the given group's context.
        const students = await getAvailableStudents();
        console.log(students);
        setAvailableStudents(students.students);
      } catch (error) {
        console.error("Error fetching available students:", error);
        setErrorMessage(
          "Failed to fetch available students. Please try again."
        );
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  // Render details view
  const renderDetailsView = () => {
    const guideDetails = getGuideDetails(selectedGroup.guide.name);
    // eslint-disable-next-line no-unused-vars
    const hasMembers =
      selectedGroup.members && selectedGroup.members.length > 0;

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
            <h2 className="text-2xl font-bold text-accent-teal mb-4">
              Project Details
            </h2>
            <div className="space-y-4 text-white/90">
              <div className="flex items-center">
                <BookOpen
                  size={20}
                  className="mr-3 text-accent-teal animate-icon-pulse"
                />
                <p className="font-semibold">Project Title:</p>
                <span className="ml-2">{selectedGroup.projectTitle}</span>
              </div>
              <div className="flex items-center">
                <Users
                  size={20}
                  className="mr-3 text-accent-teal animate-icon-pulse"
                />
                <p className="font-semibold">Course:</p>
                <span className="ml-2">
                  {selectedGroup.members[0]?.className}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-accent-teal text-lg mr-3">🗓️</span>
                <p className="font-semibold">Year:</p>
                <span className="ml-2">{selectedGroup.year}</span>
              </div>
              <div className="flex items-center">
                <Code
                  size={20}
                  className="mr-3 text-accent-teal animate-icon-pulse"
                />
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
              <h2 className="text-2xl font-bold text-accent-teal">
                {" "}
                Guide Details{" "}
              </h2>
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
                <User
                  size={20}
                  className="mr-3 text-accent-teal animate-icon-pulse"
                />
                <p className="font-semibold">Name:</p>
                <span className="ml-2">{guideDetails.name}</span>
              </div>
              <div className="flex items-center">
                <Code
                  size={20}
                  className="mr-3 text-accent-teal animate-icon-pulse"
                />
                <p className="font-semibold">Expertise:</p>
                <span className="ml-2">{guideDetails.expertise}</span>
              </div>
              <div className="flex items-center">
                <Smartphone
                  size={20}
                  className="mr-3 text-accent-teal animate-icon-pulse"
                />
                <p className="font-semibold">Mobile:</p>
                <span className="ml-2">{guideDetails.mobile}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-accent-teal">
              {" "}
              Group Members{" "}
            </h2>
            <button
              onClick={handleOpenAddStudentModal}
              className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once hover:bg-opacity-90 hover:scale-105"
              aria-label="Add student"
            >
              <Plus size={20} className="mr-2" /> Add Student
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {selectedGroup.members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 p-4 rounded-lg border border-white/20"
              >
                <div className="flex items-center">
                  <User
                    size={24}
                    className="text-accent-teal mr-4 animate-icon-pulse"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-white">
                      {" "}
                      {member.name}{" "}
                    </span>
                    <div className="text-sm text-white/80">
                      <span className="mr-4">
                        Enrollment: {member.enrollment}
                      </span>
                      <span>Class: {member.className}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setStudentToDelete(member);
                    setShowDeleteStudentModal(true);
                  }}
                  className="text-red-400 hover:text-red-500 transition duration-200 p-2 rounded-full hover:bg-white/10"
                  aria-label={`Remove student ${member.name}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Modals for Guide Change, Delete Group, Add Student, Delete Student */}
        {showChangeGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-dark-glass p-8 rounded-xl shadow-2xl border border-white/30 w-full max-w-md animate-zoom-in">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowChangeGuideModal(false)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Close change guide modal"
                >
                  <X size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-accent-teal mb-6 text-center tracking-tight">
                Change Guide for {selectedGroup.name}
              </h2>
              <FilterDropdown
                title="Select New Guide"
                options={activeGuides.map((guide) => guide.name)}
                selected={newGuide}
                onSelect={setNewGuide}
                className="mb-6 w-full"
              />
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowChangeGuideModal(false)}
                  className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                  aria-label="Cancel change guide"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGuideChange}
                  disabled={!newGuide}
                  className={`flex items-center text-white py-2 px-4 sm:px-3 rounded-lg font-semibold transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once ${
                    newGuide
                      ? "bg-gradient-to-r from-accent-teal to-cyan-500 hover:bg-opacity-90 hover:scale-105"
                      : "bg-gray-400/50 cursor-not-allowed"
                  }`}
                  aria-label="Save new guide"
                >
                  Save Change
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-dark-glass p-8 rounded-xl shadow-2xl border border-white/30 w-full max-w-md animate-zoom-in">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Close add student modal"
                >
                  <X size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-accent-teal mb-6 text-center tracking-tight">
                Add Student to {selectedGroup.name}
              </h2>
              {selectedGroup.members.length >= 4 ? (
                <p className="text-red-400 text-center mb-6 font-semibold">
                  Group is full (Max 4 students).
                </p>
              ) : availableStudents.length === 0 ? (
                <p className="text-white/70 text-center mb-6">
                  No unassigned students available for this group's course/year.
                </p>
              ) : (
                <FilterDropdown
                  title="Select Student"
                  options={availableStudents.map(
                    (student) => `${student.name} (${student.enrollmentNumber})`
                  )}
                  selected={
                    newStudent
                      ? availableStudents.find(
                          (s) => s.enrollmentNumber === newStudent
                        )?.name
                      : ""
                  }
                  onSelect={(option) => {
                    const enrollment = option.match(/\(([^)]+)\)/)?.[1];
                    setNewStudent(enrollment);
                  }}
                  className="mb-6 w-full"
                />
              )}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex items-center bg-gray-600/80 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
                  aria-label="Cancel adding student"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  disabled={!newStudent || selectedGroup.members.length >= 4}
                  className={`flex items-center text-white py-2 px-4 sm:px-3 rounded-lg font-semibold transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once ${
                    newStudent && selectedGroup.members.length < 4
                      ? "bg-gradient-to-r from-accent-teal to-cyan-500 hover:bg-opacity-90 hover:scale-105"
                      : "bg-gray-400/50 cursor-not-allowed"
                  }`}
                  aria-label="Add student"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-dark-glass p-8 rounded-xl shadow-2xl border border-white/30 w-full max-w-md animate-zoom-in">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteStudentModal(false)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Close delete student modal"
                >
                  <X size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">
                Confirm Removal
              </h2>
              {selectedGroup.members.length <= 3 ? (
                <p className="text-red-400 text-center mb-6 font-semibold">
                  Cannot remove student: Minimum 3 students required in the
                  group.
                </p>
              ) : (
                <p className="text-white/80 text-center mb-6">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-accent-teal">
                    "{studentToDelete?.name}"
                  </span>{" "}
                  from the group?
                </p>
              )}
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
                  disabled={selectedGroup.members.length <= 3}
                  className={`flex items-center py-2 px-4 sm:px-3 rounded-lg font-semibold transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once ${
                    selectedGroup.members.length > 3
                      ? "bg-red-500/80 hover:bg-red-600 hover:scale-105 text-white"
                      : "bg-gray-400/50 cursor-not-allowed text-gray-700"
                  }`}
                  aria-label="Remove student"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-dark-glass p-8 rounded-xl shadow-2xl border border-white/30 w-full max-w-md animate-zoom-in">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Close delete group modal"
                >
                  <X size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">
                Confirm Deletion
              </h2>
              <p className="text-white/80 text-center mb-6">
                Are you sure you want to delete the group{" "}
                <span className="font-semibold text-accent-teal">
                  "{selectedGroup.name}"
                </span>
                ? This action cannot be undone.
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
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    // Determine the groups to display based on filters
    const displayedGroups = groups.filter((group) => {
      // Filtering is primarily done on the API side now, but keep this for client-side safety/consistency if initial data fetch is "All Years"
      const yearMatches =
        selectedYearFilter === "All Years" ||
        group.year.toString() === selectedYearFilter;

      // Class filtering is removed as per API constraint

      return yearMatches;
    });

    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center bg-gradient-to-r from-accent-teal to-cyan-500 text-white py-2 px-4 sm:px-3 rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-neumorphic border border-white/20 backdrop-blur-sm animate-pulse-once"
            aria-label="Back to admin dashboard"
          >
            <ChevronLeft size={20} className="mr-2" /> Dashboard
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg flex-grow text-center tracking-tight">
            Group Management
          </h1>
          {/* Placeholder for future "Create Group" button */}
          <div className="w-24 sm:w-40"></div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-8 justify-center">
          {/* Removed Class Filter */}
          <FilterDropdown
            title="Filter by Year"
            options={allYears}
            selected={selectedYearFilter}
            onSelect={setSelectedYearFilter}
            className="w-40"
          />
          {/* <FilterDropdown
            title="Filter by Class"
            options={allClassNames}
            selected={selectedClassFilter}
            onSelect={setSelectedClassFilter}
            className="w-40"
          /> */}
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-500/20 text-green-300 border border-green-500 p-4 rounded-lg mb-6 text-center shadow-neumorphic animate-fade-in-down">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500/20 text-red-300 border border-red-500 p-4 rounded-lg mb-6 text-center shadow-neumorphic animate-fade-in-down">
            {errorMessage}
          </div>
        )}

        {/* Group List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGroups.length > 0 ? (
            displayedGroups.map((group) => (
              <div
                key={group._id}
                className="bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30 hover:shadow-neumorphic-hover transition duration-300 cursor-pointer flex flex-col justify-between animate-fade-in-up"
                onClick={() => handleViewDetails(group)}
              >
                <div>
                  <h2 className="text-2xl font-bold text-accent-teal mb-3 truncate">
                    {group.name}
                  </h2>
                  <p className="text-white/80 flex items-center mb-2">
                    <BookOpen size={16} className="mr-2 text-cyan-400" />
                    <span className="font-semibold mr-1">Project:</span>
                    <span className="truncate">{group.projectTitle}</span>
                  </p>
                  <p className="text-white/80 flex items-center mb-2">
                    <User size={16} className="mr-2 text-cyan-400" />
                    <span className="font-semibold mr-1">Guide:</span>
                    <span>{group.guide.name}</span>
                  </p>
                  <p className="text-white/80 flex items-center mb-2">
                    <Hash size={16} className="mr-2 text-cyan-400" />
                    <span className="font-semibold mr-1">Members:</span>
                    <span>{group.members.length}</span>
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(group);
                    }}
                    className="flex items-center text-white bg-accent-teal/80 hover:bg-accent-teal px-3 py-1 rounded-lg font-medium transition duration-200"
                    aria-label={`View details for group ${group.name}`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-10 bg-light-glass backdrop-blur-sm p-6 rounded-xl shadow-neumorphic border border-white/30">
              <p className="text-xl text-white/80">
                No groups found for the selected filter(s).
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8">
      {selectedGroup ? renderDetailsView() : renderListView()}
    </div>
  );
}

export default GroupManagement;
