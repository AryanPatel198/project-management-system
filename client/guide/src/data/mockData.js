// Mock data for guide panel testing

export const mockStudents = [
  {
    id: 's1',
    name: 'Ananya Sharma',
    rollNo: 202404104610001,
    email: 'ananya.sharma@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's2',
    name: 'Rahul Verma',
    rollNo: 202404104610002,
    email: 'rahul.verma@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's3',
    name: 'Priya Patel',
    rollNo: 202404104610003,
    email: 'priya.patel@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's4',
    name: 'Amit Kumar',
    rollNo: 202404104610004,
    email: 'amit.kumar@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's5',
    name: 'Neha Singh',
    rollNo: 202404104610005,
    email: 'neha.singh@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's6',
    name: 'Vikram Yadav',
    rollNo: 202404104610006,
    email: 'vikram.yadav@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's7',
    name: 'Sneha Desai',
    rollNo: 202404104610007,
    email: 'sneha.desai@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's8',
    name: 'Rajesh Mehta',
    rollNo: 202404104610008,
    email: 'rajesh.mehta@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's9',
    name: 'Pooja Joshi',
    rollNo: 202404104610009,
    email: 'pooja.joshi@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  },
  {
    id: 's10',
    name: 'Mohit Agarwal',
    rollNo: 202404104610010,
    email: 'mohit.agarwal@example.com',
    division: 'MCA',
    year: '2024',
    status: 'Active'
  }
];

export const mockGroups = [
  {
    id: 'g1',
    name: 'Alpha Team',
    guideId: 'guide1',
    students: ['s1', 's2', 's3'],
    projectId: 'p1',
    status: 'Active',
    createdAt: '2024-01-10'
  },
  {
    id: 'g2',
    name: 'Beta Squad',
    guideId: 'guide1',
    students: ['s4', 's5', 's6'],
    projectId: 'p2',
    status: 'Active',
    createdAt: '2024-01-12'
  },
  {
    id: 'g3',
    name: 'Gamma Team',
    guideId: 'guide1',
    students: ['s7', 's8', 's9'],
    projectId: null,
    status: 'Inactive',
    createdAt: '2024-01-15'
  },
  {
    id: 'g4',
    name: 'Delta Group',
    guideId: 'guide2',
    students: ['s10'],
    projectId: null,
    status: 'Pending',
    createdAt: '2024-01-18'
  }
];

export const mockProjects = [
  {
    id: 'p1',
    title: 'E-commerce Platform',
    description: 'A comprehensive e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.',
    technology: 'MERN Stack',
    platform: 'Web Application',
    year: '2024',
    groupId: 'g1',
    status: 'approved',
    submittedBy: 'Ananya Sharma',
    submittedDate: '2024-01-15',
    feedback: 'Excellent proposal with clear implementation plan.'
  },
  {
    id: 'p2',
    title: 'Healthcare App',
    description: 'Mobile application for healthcare management with patient records, appointment scheduling, and telemedicine features.',
    technology: 'Flutter',
    platform: 'Mobile',
    year: '2024',
    groupId: 'g2',
    status: 'approved',
    submittedBy: 'Rahul Verma',
    submittedDate: '2024-01-14',
    feedback: 'Good concept, needs more detailed technical specifications.'
  },
  {
    id: 'p3',
    title: 'Smart Home System',
    description: 'IoT-based smart home automation system with remote control and monitoring capabilities.',
    technology: 'Python, IoT',
    platform: 'Embedded Systems',
    year: '2024',
    groupId: 'g3',
    status: 'pending',
    submittedBy: 'Priya Patel',
    submittedDate: '2024-01-20',
    feedback: ''
  },
  {
    id: 'p4',
    title: 'Social Media Analytics',
    description: 'Analytics dashboard for social media metrics and engagement tracking.',
    technology: 'React, Node.js',
    platform: 'Web Dashboard',
    year: '2024',
    groupId: null,
    status: 'rejected',
    submittedBy: 'Amit Kumar',
    submittedDate: '2024-01-08',
    feedback: 'Scope too broad. Please refine the proposal with specific metrics.'
  }
];

export const mockFeedback = [
  {
    id: 'f1',
    groupId: 'g1',
    guideId: 'guide1',
    starRating: 4,
    notes: 'Good progress on authentication module. Need to focus on payment integration next.',
    createdAt: '2024-01-20'
  },
  {
    id: 'f2',
    groupId: 'g2',
    guideId: 'guide1',
    starRating: 3,
    notes: 'Database design needs improvement. Consider normalizing the schema.',
    createdAt: '2024-01-19'
  },
  {
    id: 'f3',
    groupId: 'g1',
    guideId: 'guide1',
    starRating: 5,
    notes: 'Excellent UI implementation! Very responsive and user-friendly.',
    createdAt: '2024-01-18'
  }
];

export const mockSchedules = [
  {
    id: 'sch1',
    title: 'Alpha Team - Progress Review',
    date: '2024-01-25',
    time: '14:00',
    scheduleType: 'seminar',
    groupId: 'g1',
    status: 'scheduled'
  },
  {
    id: 'sch2',
    title: 'Beta Squad - Technical Discussion',
    date: '2024-01-26',
    time: '15:30',
    scheduleType: 'meeting',
    groupId: 'g2',
    status: 'scheduled'
  },
  {
    id: 'sch3',
    title: 'Gamma Team - Project Proposal',
    date: '2024-01-27',
    time: '11:00',
    scheduleType: 'seminar',
    groupId: 'g3',
    status: 'pending'
  }
];

// Current guide (for testing)
export const currentGuide = {
  id: 'guide1',
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@example.com',
  department: 'Computer Engineering',
  expertise: 'MERN Stack, AI/ML',
  phone: '+91 98765 43210',
  status: 'Active',
  groups: ['g1', 'g2', 'g3']
};
