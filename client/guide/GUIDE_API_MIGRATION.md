# Guide Module API Migration

This document outlines the migration from static/mock data to API calls in the Guide Module of the MERN project.

## Overview

The Guide Module has been successfully converted from using static mock data to making API calls to the backend, with graceful fallback to mock data when the API is not available.

## Key Changes

### 1. API Service (`src/services/api.js`)

- **Converted from fetch to axios**: All HTTP requests now use axios for better error handling and request/response interceptors
- **Added guidePanelAPI**: New comprehensive API object with all guide-specific endpoints
- **RESTful endpoints**: Following REST conventions for all guide operations
- **Automatic token handling**: Axios interceptors automatically add authentication tokens
- **Error handling**: Centralized error handling with automatic logout on 401 errors

### 2. API Endpoints Structure

```javascript
// Guide Profile Management
GET    /api/guides/:id/profile
PUT    /api/guides/:id/profile

// Guide Dashboard Data
GET    /api/guides/:id/dashboard
GET    /api/guides/:id/stats

// Guide's Students Management
GET    /api/guides/:id/students
GET    /api/guides/:id/students/:studentId

// Guide's Groups Management
GET    /api/guides/:id/groups
GET    /api/guides/:id/groups/:groupId
POST   /api/guides/:id/groups
PUT    /api/guides/:id/groups/:groupId
DELETE /api/guides/:id/groups/:groupId

// Guide's Projects Management
GET    /api/guides/:id/projects
GET    /api/guides/:id/projects/:projectId
POST   /api/guides/:id/projects/:projectId/approve
POST   /api/guides/:id/projects/:projectId/reject

// Guide's Feedback Management
GET    /api/guides/:id/feedback
GET    /api/guides/:id/feedback/:feedbackId
POST   /api/guides/:id/feedback
PUT    /api/guides/:id/feedback/:feedbackId
DELETE /api/guides/:id/feedback/:feedbackId

// Guide's Evaluations
GET    /api/guides/:id/evaluations
GET    /api/guides/:id/evaluations/:evaluationId
POST   /api/guides/:id/evaluations
PUT    /api/guides/:id/evaluations/:evaluationId

// Guide's Announcements
GET    /api/guides/:id/announcements
GET    /api/guides/:id/announcements/:announcementId

// Guide's Schedules/Meetings
GET    /api/guides/:id/schedules
GET    /api/guides/:id/schedules/:scheduleId
POST   /api/guides/:id/schedules
PUT    /api/guides/:id/schedules/:scheduleId
DELETE /api/guides/:id/schedules/:scheduleId
```

### 3. Component Updates

#### GuideDashboard.jsx
- **API Integration**: Fetches dashboard data, announcements, and profile from API
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Displays warning when API is not available
- **Fallback**: Automatically falls back to mock data when API fails
- **Dynamic Content**: Guide name and profile info loaded from API

#### GroupManagement.jsx
- **CRUD Operations**: All group operations (Create, Read, Update, Delete) use API calls
- **Real-time Updates**: Groups list updates after successful API operations
- **Error Handling**: Shows error messages for failed operations
- **Mock Fallback**: Falls back to mock data when API is unavailable

#### Profile.jsx
- **Profile Management**: Profile updates and password changes use API calls
- **Loading States**: Shows loading indicators during operations
- **Error Handling**: Displays errors for failed operations
- **Mock Fallback**: Falls back to mock data when API is unavailable

### 4. Key Features

#### Graceful Fallback
All components automatically fall back to mock data when the API is not available, ensuring the application continues to work during development or when the backend is not ready.

#### Loading States
- Initial loading states while fetching data
- Operation loading states during API calls
- Visual feedback with spinners and loading messages

#### Error Handling
- Network error handling
- API error handling
- User-friendly error messages
- Automatic retry with mock data fallback

#### Authentication
- Automatic token handling via axios interceptors
- Automatic logout on 401 errors
- Token-based API requests

## Usage Examples

### Basic API Call Pattern

```javascript
import { guidePanelAPI, authAPI } from '../services/api';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const guideId = authAPI.getCurrentUser()?.id || 'guide1';
        const result = await guidePanelAPI.getGuideGroups(guideId);
        setData(result || []);
        setUseMockData(false);
        
      } catch (apiError) {
        console.warn('API not available, falling back to mock data:', apiError);
        setData(mockData);
        setUseMockData(true);
        setError('Using mock data - API not available');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Component JSX...
};
```

### CRUD Operations

```javascript
// Create
const handleCreate = async (newData) => {
  try {
    const guideId = authAPI.getCurrentUser()?.id || 'guide1';
    const result = await guidePanelAPI.createGroup(guideId, newData);
    setData([...data, result]);
  } catch (error) {
    console.error('Error creating:', error);
    setError('Failed to create');
  }
};

// Update
const handleUpdate = async (id, updatedData) => {
  try {
    const guideId = authAPI.getCurrentUser()?.id || 'guide1';
    const result = await guidePanelAPI.updateGroup(guideId, id, updatedData);
    setData(data.map(item => item.id === id ? result : item));
  } catch (error) {
    console.error('Error updating:', error);
    setError('Failed to update');
  }
};

// Delete
const handleDelete = async (id) => {
  try {
    const guideId = authAPI.getCurrentUser()?.id || 'guide1';
    await guidePanelAPI.deleteGroup(guideId, id);
    setData(data.filter(item => item.id !== id));
  } catch (error) {
    console.error('Error deleting:', error);
    setError('Failed to delete');
  }
};
```

## Backend Requirements

The following backend endpoints need to be implemented to support the frontend:

1. **Authentication endpoints** (already exist)
2. **Guide profile management**
3. **Guide dashboard data**
4. **Group management**
5. **Project management**
6. **Feedback system**
7. **Evaluation system**
8. **Announcements**
9. **Scheduling system**

## Migration Benefits

1. **Real-time Data**: Components now fetch live data from the backend
2. **Scalability**: Easy to add new features and endpoints
3. **Error Handling**: Robust error handling with user feedback
4. **Development Friendly**: Falls back to mock data during development
5. **Production Ready**: Seamless transition to production API
6. **Maintainable**: Centralized API management with consistent patterns

## Next Steps

1. Implement the backend API endpoints
2. Test API integration with real backend
3. Remove mock data fallbacks once backend is stable
4. Add more sophisticated error handling and retry logic
5. Implement caching for better performance
6. Add optimistic updates for better UX

## Files Modified

- `src/services/api.js` - Updated with axios and new guide API functions
- `src/pages/guide/GuideDashboard.jsx` - Converted to use API calls
- `src/pages/guide/GroupManagement.jsx` - Converted to use API calls
- `src/pages/guide/Profile.jsx` - Converted to use API calls
- `src/examples/GuideAPIExample.jsx` - Example component showing usage pattern

## Dependencies Added

- `axios` - For HTTP requests with better error handling and interceptors
