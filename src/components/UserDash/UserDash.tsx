import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDash.css';

interface UserInfo {
  role: string;
  username: string;
}

const UserDash: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
   
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/userinfo', {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data: UserInfo = await response.json();

        if (data.role === 'ROLE_CLIENT') {
          setUserInfo(data); 
        } else {
          setError(true); //an einai o rolos admin den 8elw na mpainei kai na mhn deixnei kati
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(true); 
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return (
      <div className="error-page">
        <h1>You are not Logged in!</h1>
        <p>Please Log in!</p>
      </div>
    );
  }

  if (!userInfo) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="user-page">
      <h1>Hello, {userInfo.username}</h1>
      <p>This is your Dashboard, being a user you have access to our best point system, you can view all your rents, your points and your account details!</p>
      <div className="button-container">
        <button className="user-button" onClick={() => navigate('/memberrent')}>
          Rent With the Membership
        </button>
        <button className="user-button" onClick={() => navigate('/userrents')}>
          Rents
        </button>
        <button className="user-button" onClick={() => navigate('/accdetails')}>
          Details And Points!
        </button>
      </div>
    </div>
  );
};

export default UserDash;
