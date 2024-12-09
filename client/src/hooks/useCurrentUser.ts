import { useState, useEffect } from 'react';
import getCurrentUser from '../utils/get-current-user/get-current-user';
import type { userDetails } from '../../../src/models/User';

const useCurrentUser = () => {
  const [userData, setUserData] = useState<userDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        console.log('Fetched user data:', user); // Logs fetched user data
        setUserData(user ?? null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading };
};

export default useCurrentUser;
