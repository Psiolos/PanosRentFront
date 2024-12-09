import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCar.css'

const BookingForm: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setErrorMessage('Fill both.');
      return;
    }

    
    const group = "All";

    
    navigate(`/cars?startDate=${startDate}&endDate=${endDate}&group=${group}`);
  };

  return (
    <div className="book-section">
      <div className="book-content">
        <div className="book-content__box">
          <h2>Check Dates For Rent!!!</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="booking-done">{successMessage}</div>}
          <form className="box-form" onSubmit={handleSubmit}>
            <div className="box-form__car-time">
              <label htmlFor="startDate">Rent Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const selectedStartDate = e.target.value;
                  setStartDate(selectedStartDate);
                  if (endDate && selectedStartDate > endDate) {
                    setEndDate("");
                  }
                }}
                min={today}
              />
            </div>
            <div className="box-form__car-time">
              <label htmlFor="endDate">Rent End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
              />
            </div>
            <button type="submit">See Available Cars!</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
