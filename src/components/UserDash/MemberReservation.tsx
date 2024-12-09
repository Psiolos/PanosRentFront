import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../Booking/Booking.css';
import CarInsurance from "../../images/others/carinsurance.jpg";

const MemberReservation = () => {
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
  const [points, setPoints] = useState(0); 
  const [redeemPoints, setRedeemPoints] = useState(0); 
  const [initialPoints, setInitialPoints] = useState(0);
  
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/userinfo/details", {
          method: 'GET', 
          credentials: 'include',
        })
        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
        setIdentityNumber(data.idCard || "");
        setPoints(data.points || 0); 
        setInitialPoints(data.points || 0);
      } catch (error) {
        console.error("Error fetching user info:", error);
        alert("Failed to load user data.");
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [startDate, endDate, extraServiceSelected, redeemPoints]);

  useEffect(() => {
    calculatePoints();
  }, [totalCost, redeemPoints]);

  const calculatePoints = () => {
    
    const pointsEarned = Math.floor(totalCost / 10); // 1 ponto stoggila pros ta panw ana 10ada
    const remainingPoints = initialPoints - redeemPoints; 

    
    if (remainingPoints >= 0) {
      setPoints(remainingPoints + pointsEarned); 
    } else {
      setPoints(pointsEarned);
    }
  };

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
      pointsUsed: redeemPoints, 
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

      
      const pointsEarned = Math.ceil(totalCost / 10); 
      const newPoints = points; 

      
      console.log("Initial Points:", initialPoints);
        console.log("Redeem Points:", redeemPoints);
        console.log("Points Earned:", pointsEarned);
        console.log("points return:", newPoints);
        
        console.log("Request body:", JSON.stringify({ points }));
         const pointsUpdateResponse = await fetch("http://localhost:8080/auth/update-points", {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ points }),
        });
        console.log("Response status:", pointsUpdateResponse.status);
          const responseData = await pointsUpdateResponse.json();
          console.log("Response data:", responseData);

            

      if (!pointsUpdateResponse.ok) {
        const errorData = await pointsUpdateResponse.json();
        throw new Error(`Error updating points: ${errorData.message || pointsUpdateResponse.statusText}`);
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

    if (extraServiceSelected) {
      if (daysDiff == 0) {
        cost += 20;
      } else {
        cost += (daysDiff + 1) * 20;
      }
    }

    setDaysDiff(daysDiff);
    setTotalCost(cost);
  };

  
  const maxPointsCanUse = initialPoints ; 

  return (
    <div className="booking-page">
      <div className="booking-form">
        <h1>Booking Information</h1>
        <div>
          <label>First Name</label>
          <input type="text" value={firstName} disabled />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" value={lastName} disabled />
        </div>
        <div>
          <label>Phone</label>
          <input type="text" value={phone} disabled />
        </div>
        <div>
          <label>Identity Number</label>
          <input type="text" value={identityNumber} disabled />
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

       
        <div className="user-points">
          <h3>Your Points: {initialPoints }</h3>
          <div className="redeem-points">
            <label>Use points for a discount:</label>
            <input
              type="number"
              min="0"
              max={maxPointsCanUse}
              value={redeemPoints 
              }
              onChange={(e) => setRedeemPoints(Math.min(Number(e.target.value), maxPointsCanUse))}

            />
            <p>1 point = 1 euro discount</p>
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
                €{(totalCost - redeemPoints).toFixed(2)}
              </>
            ) : (
              <>€{(totalCost - redeemPoints).toFixed(2)}</>
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
            <p>Price per Day: €{car.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberReservation;
