import React, { useState, useEffect } from 'react';
import { guidePanelAPI, authAPI } from '../services/api';
import { mockGroups, currentGuide } from '../data/mockData';

/**
 * Example component showing how to use the new Guide API with fallback to mock data
 * This demonstrates the pattern used in all guide components
 */
export default function GuideAPIExample() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Get current guide ID from localStorage or use mock data
  const getCurrentGuideId = () => {
    const user = authAPI.getCurrentUser();
    return user?.id || 'guide1'; // fallback to mock guide ID
  };

  // Fetch data from API with fallback to mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const guideId = getCurrentGuideId();
        
        // Try to fetch from API first
        const groupsData = await guidePanelAPI.getGuideGroups(guideId);
        setGroups((groupsData && groupsData.data) || []);
        setUseMockData(false);
        
      } catch (apiError) {
        console.warn('API not available, falling back to mock data:', apiError);
        
        // Fallback to mock data
        setGroups(mockGroups);
        setUseMockData(true);
        setError('Using mock data - API not available');
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Example of creating a new group
  const handleCreateGroup = async (groupData) => {
    try {
      const guideId = getCurrentGuideId();
      
      if (useMockData) {
        // Mock data fallback
        const newGroup = {
          id: `g${Date.now()}`,
          ...groupData,
          currentMembers: 0,
          status: 'Active',
          startDate: new Date().toISOString().split('T')[0],
          members: []
        };
        setGroups([...groups, newGroup]);
      } else {
        // API call
        const newGroup = await guidePanelAPI.createGroup(guideId, groupData);
        setGroups([...groups, (newGroup && newGroup.data) || newGroup]);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Guide API Example</h2>
      {error && <div style={{color: 'orange'}}>⚠️ {error}</div>}
      <p>Groups loaded: {groups.length}</p>
      <p>Using mock data: {useMockData ? 'Yes' : 'No'}</p>
    </div>
  );
}
