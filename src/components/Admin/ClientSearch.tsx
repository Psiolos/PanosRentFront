import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ClientSearch.css";

interface Car {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  available: boolean;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  idCard: string;
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

const ClientSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [clientData, setClientData] = useState<Client | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkUserRole = async () => {
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

    checkUserRole();
  }, [navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search") || "";
    if (searchParam) {
      setSearchInput(searchParam);
      handleSearch(searchParam);
    }
  }, [location]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const clientResponse = await fetch(
        `http://localhost:8080/clients/${query}`,
        { credentials: "include" }
      );
      if (!clientResponse.ok) {
        throw new Error("Client not found");
      }
      const client = await clientResponse.json();
      setClientData(client);

      const reservationsResponse = await fetch(
        `http://localhost:8080/reservations/client/${client.id}`,
        { credentials: "include" }
      );
      if (!reservationsResponse.ok) {
        throw new Error("Reservations not found");
      }
      const reservationsData: Reservation[] = await reservationsResponse.json();
      setReservations(reservationsData);
    } catch (err: any) {
      setError(err.message);
      setClientData(null);
      setReservations([]);
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
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }
      await handleSearch(searchInput);
    } catch (err: any) {
      setError("Error cancelling reservation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-search-container">
      <h1>Client Search</h1>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter Phone or ID Card"
        className="client-input-box"
      />
      <button
        onClick={() => handleSearch(searchInput)}
        className="search-btn"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="error-msg">{error}</p>}

      {clientData && (
        <div className="client-info-container">
          <h2>Client Details</h2>
          <p>
            <strong>Name:</strong> {clientData.firstName} {clientData.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {clientData.phone}
          </p>
          <p>
            <strong>ID Card:</strong> {clientData.idCard}
          </p>

          <h3>Reservations</h3>
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
      )}
    </div>
  );
};

export default ClientSearch;
