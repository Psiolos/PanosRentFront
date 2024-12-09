import React, { useState, useEffect } from "react";
import '../Admin/ClientSearch.css'

interface Car {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  available: boolean;
}

interface Reservation {
  id: number;
  car: Car;
  startDate: string;
  endDate: string;
  totalPrice: string;
  superInsurance: boolean;
  status: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  idCard: string;
  clientId: number;
}

const UserRents: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userResponse = await fetch('http://localhost:8080/auth/userinfo/details', {
            method: 'GET', 
            credentials: 'include', // edw to authenticate apo cookie
          })
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData: UserDetails = await userResponse.json();
        setUserDetails(userData);
        await fetchReservations(userData.clientId);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const fetchReservations = async (clientId: number) => {
    setLoading(true);
    try {
      const reservationsResponse = await fetch(
        `http://localhost:8080/reservations/client/${clientId}`
      );
      if (!reservationsResponse.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const reservationsData: Reservation[] = await reservationsResponse.json();
      setReservations(reservationsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/reservations/cancel/${reservationId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }
      await fetchReservations(userDetails!.clientId);
    } catch (err: any) {
      setError("Error cancelling reservation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-search-container">
      <h1>Your Reservations</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {userDetails && (
        <div className="client-info-container">
          <h2>User Details</h2>
          <p>
            <strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails.phone}
          </p>
          <p>
            <strong>ID Card:</strong> {userDetails.idCard}
          </p>
        </div>
      )}

      <h3>Your Reservations</h3>
      {reservations.length > 0 ? (
        <ul className="reservation-container">
          {reservations.map((res) => (
            <li key={res.id} className="reservation-entry">
              <p>
                <strong>Car:</strong> {res.car.brand} {res.car.model} (
                {res.car.licensePlate})
              </p>
              <p>
                <strong>From:</strong> {res.startDate} <strong>To:</strong>{" "}
                {res.endDate}
              </p>
              <p>
                <strong>Total Price:</strong> €{res.totalPrice}
              </p>
              <p>
                <strong>Super Insurance:</strong>{" "}
                {res.superInsurance ? "Yes" : "No"}
              </p>
              <p
                className={
                  res.status === "confirmed"
                    ? "status-confirmed"
                    : "status-cancelled"
                }
              >
                <strong>Status:</strong> {res.status}
              </p>
              {res.status === "confirmed" && (
                <button
                  onClick={() => handleCancelReservation(res.id)}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

export default UserRents;
