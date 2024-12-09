import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/userinfo', {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role === 'ROLE_ADMIN') {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            navigate('/not-found'); 
          }
        } else {
          setIsAuthorized(false);
          navigate('/not-found');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setIsAuthorized(false);
        navigate('/not-found');
      }
    };

    checkAuthorization();
  }, [navigate]);

  if (isAuthorized === null) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="admin-page">
      <h1>Admin Settings</h1>
      <div className="button-container">
        <button className="admin-button" onClick={() => navigate('/carlist')}>Show Cars</button>
        <button className="admin-button" onClick={() => navigate('/addcar')}>Add Car</button>
        <button className="admin-button" onClick={() => navigate('/showrentals')}>Show Rentals</button>
        <button className="admin-button" onClick={() => navigate('/customers')}>Show Customers</button>
        <button className="admin-button" onClick={() => navigate('/searchrentbycar')}>Search by License Plate</button>
        <button className="admin-button" onClick={() => navigate('/searchbycustom')}>Search by Customer</button>
        <button className="admin-button" onClick={() => navigate('/income')}>See Income</button>
      </div>
    </div>
  );
};

export default AdminPage;
