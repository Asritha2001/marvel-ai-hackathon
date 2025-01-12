import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('No user ID found. Please login again.');
        console.log('userId not found');
        return;
      }
      try {
        const response = await axiosInstance.get(`/getUserData/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {userData ? (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
