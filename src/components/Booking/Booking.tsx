import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './Booking.css';
import CarInsurance from "../../images/others/carinsurance.jpg";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state.car;
  const startDate = location.state.startDate;
  const endDate = location.state.endDate;

  const [daysDiff, setDaysDiff] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [extraServiceSelected, setExtraServiceSelected] = useState(false);

  useEffect(() => {
    calculateTotalCost();
  }, [startDate, endDate, extraServiceSelected]);

  const handleBooking = async () => {
    const rentalData = {
      carId: car.id,
      startDate,
      endDate,
      firstName,
      lastName,
      phone,
      idCard: identityNumber,
      superInsurance: extraServiceSelected,
      totalPrice: totalCost,
    };

    try {
      const response = await fetch("http://localhost:8080/reservations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rentalData),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`Error creating reservation: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      alert("Reservation created successfully!");
      console.log("Reservation data:", data);
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create reservation. Please try again.");
    }
  };

  const calculateTotalCost = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    let cost = daysDiff > 0 ? daysDiff * car.price : 0;

    
    if (daysDiff == 0) {
      cost = car.price;
    } else if (daysDiff < 4) {
      cost = cost + car.price;
    } else if (daysDiff >= 5) {
      cost *= 0.8; 
    }

    // Epilogi superinsurance
    if (extraServiceSelected) {
      if (daysDiff ==0 ) {
        cost += 20;
      }
      else{
      cost += (daysDiff+1) * 20;
      } 
    }

    setDaysDiff(daysDiff);
    setTotalCost(cost);
  };

  return (
    <div className="booking-page">
      <div className="booking-form">
        <h1>Booking Information</h1>
        <p>Please note, if you have rent with us in the past and you had used the same Tel or ID number we will use your details from
          your first rent, if your tel or id number changed contact via telephone or send an email!
        </p>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Identity Number</label>
          <input
            type="text"
            value={identityNumber}
            onChange={(e) => setIdentityNumber(e.target.value)}
            required
          />
        </div>
        <div className="s-booking-extras__items">
          <div className="b-extra">
            <div className="b-extra__aside">
            <img
              src={CarInsurance}
              alt="Car Insurance"
            />
            </div>
            <div className="b-extra__main">
              <div className="b-extra__title">Super Insurance</div>
              <div className="b-extra__summary">Do you want to have super insurance and have 100% safety in your travles? Now you can with 20€ per Day. </div>
            </div>
            <div className="extra-service-checkbox">
            <div className="extra-service-checkbox">
              <input
                type="checkbox"
                id="extra-service-checkbox"
                className="extra-service-checkbox-input"
                checked={extraServiceSelected}
                onChange={() => setExtraServiceSelected(!extraServiceSelected)}
              />
              <label htmlFor="extra-service-checkbox"></label>
            </div>

            </div>
          </div>
        </div>
        <div className="date-container">
          <div className="date-item">
            <p className="date-label">Start Date:</p>
            <p className="date-value">{startDate}</p>
          </div>
          <div className="date-item">
            <p className="date-label">End Date:</p>
            <p className="date-value">{endDate}</p>
          </div>
        </div>
        <div className="total-cost">
          <h3>
            Total Cost:{" "}
            {daysDiff >= 5 ? (
              <>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                €{(totalCost * 1.2).toFixed(2)}
                </span>{" "}
                €{totalCost.toFixed(2)}
              </>
            ) : (
              <>€{totalCost.toFixed(2)}</>
            )}
          </h3>
        </div>
        <button className="rent-button" onClick={handleBooking}>
          Confirm Booking
        </button>
      </div>

      <div className="car-box">
        <div className="car-header">
          <h3 className="car-title">
            {car.brand} {car.model}
          </h3>
          <p className="car-group">Group: {car.category}</p>
        </div>
        <div className="car-details">
          <div className="car-image">
            <img
              src={`http://localhost:8080/${car.photoPath}`}
              alt={`${car.brand} ${car.model}`}
            />
          </div>
          <div className="car-info">
            <p>Year: {car.year}</p>
            <p>Price per day: €{car.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
