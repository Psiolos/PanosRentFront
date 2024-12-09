import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Rental {
  rentalId: number;
  startDate: string;
  endDate: string;
  clientName: string;
}

function ViewRentals() {
  const { carId } = useParams();
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    const response = await fetch(`http://localhost:8080/api/cars/${carId}/rentals`);
    const data = await response.json();
    setRentals(data);
  };

  return (
    <div>
      <h2>Rentals for Car {carId}</h2>
      <ul>
        {rentals.map((rental) => (
          <li key={rental.rentalId}>
            <span>{rental.startDate} - {rental.endDate}</span> by {rental.clientName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewRentals;
