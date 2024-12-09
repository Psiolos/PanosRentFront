import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Reservation {
  id: number;
  customerName: string;
  startDate: string;
  endDate: string;
}

function CarReservations() {
  const { carId } = useParams<{ carId: string }>();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (carId) {
      fetchReservations(parseInt(carId));
    }
  }, [carId]);

  const fetchReservations = async (carId: number) => {
    const response = await fetch(`http://localhost:8080/cars/${carId}/reservations`);
    const data = await response.json();
    setReservations(data);
  };

  return (
    <div>
      <h1>Reservations for Car ID: {carId}</h1>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            Customer: {reservation.customerName}, Start: {reservation.startDate}, End: {reservation.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarReservations;
