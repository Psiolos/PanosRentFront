import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './ReservationList.css';

interface Car {
  brand: string;
  model: string;
  licensePlate: string;
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
  client: Client;
  car: Car;
  startDate: string;
  endDate: string;
  status: string;
}

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ startDate: string, endDate: string }>({ startDate: '', endDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/userinfo", {
        method: "GET",
        credentials: "include", 
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role !== "ROLE_ADMIN") {
          navigate("/not-found");
        } else {
          fetchReservations();
        }
      } else {
        navigate("/not-found");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
      navigate("/not-found");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:8080/reservations/all", {
        credentials: "include",
      });
      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDateRange(prevState => {
      const updatedRange = { ...prevState, [name]: value };

      // Έλεγχος για εγκυρότητα: endDate >= startDate
      if (name === 'startDate' && updatedRange.endDate && new Date(value) > new Date(updatedRange.endDate)) {
        updatedRange.endDate = value; // Προσαρμόζουμε το endDate αν είναι μικρότερο
      }

      if (name === 'endDate' && updatedRange.startDate && new Date(value) < new Date(updatedRange.startDate)) {
        updatedRange.startDate = value; // Προσαρμόζουμε το startDate αν είναι μεγαλύτερο
      }

      return updatedRange;
    });
  };

  const applyFilters = () => {
    let filtered = reservations;

    // Φιλτράρισμα με βάση το status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status.toLowerCase() === statusFilter);
    }

    // Φιλτράρισμα με βάση το date range
    if (dateRange.startDate && dateRange.endDate) {
      const filterStartDate = new Date(dateRange.startDate);
      const filterEndDate = new Date(dateRange.endDate);

      filtered = filtered.filter(reservation => {
        const reservationStartDate = new Date(reservation.startDate);
        const reservationEndDate = new Date(reservation.endDate);

        // Συνθήκη: είτε το startDate είτε το endDate είναι μέσα στο διάστημα του φίλτρου
        return (
          (reservationStartDate <= filterEndDate && reservationEndDate >= filterStartDate)
        );
      });
    }

    setFilteredReservations(filtered);
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setDateRange({ startDate: '', endDate: '' });
    setFilteredReservations(reservations);
  };

  const cancelReservation = async (reservationId: number) => {
    const confirmed = window.confirm("Do you want for sure to cancel the reservation?");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:8080/reservations/cancel/${reservationId}`, {
          method: "PUT",
          credentials: "include",
        });
        if (response.ok) {
          
          fetchReservations(); 
          applyFilters(); 
        } else {
          console.error("Reservation cancelling failed");
        }
      } catch (error) {
        console.error("Reservation cancelling failed:", error);
      }
    }
  };

  return (
    <div className="reservation-list-container">
      <h1>Reservations</h1>
      <div className="filter-container">
        <div className="date-range-filters">
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="date-picker-input"
          />
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="date-picker-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="status-filter"
        >
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="canceled">Cancelled</option>
        </select>
        <button onClick={applyFilters} className="filter-button">Apply Filter</button>
        <button onClick={resetFilters} className="reset-button">Reset Filter</button>
      </div>

      <ul className="reservation-list">
        {filteredReservations.map((reservation) => (
          <li key={reservation.id} className="reservation-item">
            <div className="reservation-info">
              <span>
                 Customer: {reservation.client.firstName} {reservation.client.lastName} (ID: {reservation.client.idCard} Telephone: {reservation.client.phone}) 
              </span>
              <span>
                  Car: {reservation.car.brand} {reservation.car.model} (License Plate: {reservation.car.licensePlate})
              </span>
              <span> From: {reservation.startDate} To: {reservation.endDate}</span>
              <span> Status: <span className={reservation.status === "confirmed" ? "status-confirmed" : "status-cancelled"}>{reservation.status}</span></span>
            </div>
            <div className="reservation-actions">
              {reservation.status !== "canceled" && (
                <button
                  onClick={() => cancelReservation(reservation.id)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationList;
