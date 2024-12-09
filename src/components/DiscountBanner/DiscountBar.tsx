import React, { useState } from 'react';
import './Banner.css';

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="discountbanner">
      <div className="discountbanner-content">
        <span className="discountbanner-text">SAVE <span>BIG</span> NOW, Rent 5 days or more and get 20% off the total price!</span>
        <button className="discountbanner-close" onClick={handleClose}>×</button>
      </div>
    </div>
  );
};

export default Banner;
