import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CarSearch.css";

interface Car {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  available: boolean;
}

interface Reservation {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  idCard: string;
  totalPrice: string;
  superInsurance: boolean;
  status: string;
}

const CarSearch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [car, setCar] = useState<Car | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [error, setError] = useState<string>("");

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/userinfo", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        const data = await response.json();
        if (data.role !== "ROLE_ADMIN") {
          navigate("/not-found"); 
        }
      } catch (error) {
        navigate("/not-found");
      }
    };
    checkAuth();
  }, [navigate]);

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const licenseFromUrl = params.get("license");
    if (licenseFromUrl) {
      setLicensePlate(licenseFromUrl);
      handleSearch(licenseFromUrl);
    }
  }, [location.search]);

  const handleSearch = async (searchLicensePlate: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/cars/find-by-license-plate/${searchLicensePlate}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Car not found");
      }
      const carData = await response.json();
      setCar(carData);

      const reservationsResponse = await fetch(
        `http://localhost:8080/reservations/car/${carData.id}`,
        {
          credentials: "include",
        }
      );
      if (!reservationsResponse.ok) {
        throw new Error("Reservations not found");
      }
      const reservationsData = await reservationsResponse.json();
      setReservations(reservationsData);
      setFilteredReservations(reservationsData);
      setError("");
    } catch (err: any) {
      setError(err.message);
      setCar(null);
      setReservations([]);
      setFilteredReservations([]);
    }
  };

  const handleCancel = async (reservationId: number) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/reservations/cancel/${reservationId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      await handleSearch(licensePlate); 
    } catch (err: any) {
      alert("Error cancelling reservation: " + err.message);
    }
  };

  const handleFilter = () => {
    if (!startDateFilter || !endDateFilter) {
      setFilteredReservations(reservations);
      return;
    }
    const start = new Date(startDateFilter);
    const end = new Date(endDateFilter);

    const filtered = reservations.filter((reservation) => {
      const reservationStart = new Date(reservation.startDate);
      return reservationStart >= start && reservationStart <= end;
    });
    setFilteredReservations(filtered);
  };

  const handleResetFilter = () => {
    setStartDateFilter("");
    setEndDateFilter("");
    setFilteredReservations(reservations);
  };

  return (
    <div className="car-search-container">
      <h1>Car Search</h1>
      <input
        type="text"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        placeholder="Enter License Plate"
        className="car-search-input-box"
      />
      <button onClick={() => handleSearch(licensePlate)} className="car-search-button">
        Search
      </button>

      {error && <p className="error-message">{error}</p>}

      {car && (
        <div className="car-details-container">
          <h1>Car Details</h1>
          <h2>
            <strong>Brand:</strong> {car.brand}
          </h2>
          <h2>
            <strong>Model:</strong> {car.model}
          </h2>
          <h2>
            <strong>License Plate:</strong> {car.licensePlate}
          </h2>
          <h2>
            <strong>Available:</strong> {car.available ? "Yes" : "No"}
          </h2>

          <div className="filter-section">
            <h3>Filter Date Choose</h3>
            <label>
              From:
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="date-picker-input"
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="date-picker-input"
              />
            </label>
            <div>
              <button onClick={handleFilter} className="filter-button">
                Apply Filter
              </button>
              {startDateFilter || endDateFilter ? (
                <button onClick={handleResetFilter} className="filter-button">
                  Reset Filter
                </button>
              ) : null}
            </div>
          </div>

          <h3>Reservations</h3>
          {filteredReservations.length > 0 ? (
            <ul className="reservation-list">
              {filteredReservations.map((reservation, index) => (
                <li key={index} className="reservation-item">
                  <p>
                    <strong>From:</strong> {reservation.startDate} <strong>To:</strong>{" "}
                    {reservation.endDate}
                  </p>
                  <p>
                    <strong>Client:</strong> {reservation.firstName} {reservation.lastName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {reservation.phone}
                  </p>
                  <p>
                    <strong>ID Card:</strong> {reservation.idCard}
                  </p>
                  <p>
                    <strong>Super Insurance:</strong> {reservation.superInsurance ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Total Price:</strong> €{reservation.totalPrice}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        reservation.status === "confirmed"
                          ? "status-confirmed"
                          : "status-cancelled"
                      }
                    >
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </p>
                  {reservation.status === "confirmed" && (
                    <button onClick={() => handleCancel(reservation.id)} className="cancel-button">
                      Cancel
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reservations found for this car.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CarSearch;
