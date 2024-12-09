import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.css';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>Page Not Found</h1>
      <p>You do not have access to this page or it doesn't exist.</p>
      <button className="back-button" onClick={() => navigate('/')}>
        Go to Home
      </button>
    </div>
  );
};

export default PageNotFound;
