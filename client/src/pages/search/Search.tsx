import React, { useState , useEffect } from 'react';
import './Search.scss'; // Create this SCSS file for styling
import UserCard from '../../views/components/user/UserCard';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []); 
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('search='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3000/api/users/find-users-by-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: token }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data); 
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userTwitter='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3000/api/user/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        console.log(`You followed user with ID: ${userId}`);
      } else {
        console.error('Failed to follow user');
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="search-page">
      <div className="user-list">
        {users.length === 0 && !isLoading && <p>No users found</p>}
        {users.map((user) => (
          <UserCard key={user._id} user={user} onFollow={handleFollow} />
        ))}
      </div>
    </div>
  );
};

export default Search;
