import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const userId = '6782c6f341c5bfd6853cc656';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://marvel-ai-hackathon.vercel.app/getUserData/${userId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

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
