import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CarList.css';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  category: string | null;
  price: number;
  photoPath: string;
  status: string;
  fuelConsumption: number;
  horsepower: number;
  available: boolean;
}

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/userinfo", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role === "ROLE_ADMIN") {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            navigate("/not-found");
          }
        } else {
          setIsAuthorized(false);
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        setIsAuthorized(false);
        navigate("/not-found");
      }
    };

    checkAuthorization();
  }, [navigate]);

  
  useEffect(() => {
    if (isAuthorized) {
      const fetchCars = async () => {
        try {
          const response = await fetch("http://localhost:8080/cars/all-cars", {
            credentials: "include", 
          });
          if (!response.ok) {
            throw new Error("Failed to fetch cars");
          }
          const data = await response.json();
          setCars(data);
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchCars();
    }
  }, [isAuthorized]);

  const handleRetireCar = async (carId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/cars/${carId}/retire`, { 
        method: "PUT",
        credentials: "include",  });
      if (!response.ok) throw new Error("Failed to retire the car");
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId ? { ...car, status: "retired", available: false } : car
        )
      );
    } catch (err: any) {
      alert("Error retiring car: " + err.message);
    }
  };

  const handleToggleAvailability = async (carId: number, available: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/cars/${carId}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !available }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update availability");
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId ? { ...car, available: !available } : car
        )
      );
    } catch (err: any) {
      alert("Error toggling availability: " + err.message);
    }
  };

  const handleUpdatePrice = async (carId: number, newPrice: number) => {
    try {
      const response = await fetch(`http://localhost:8080/cars/${carId}/price`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
        
      });
      if (!response.ok) throw new Error("Failed to update price");
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId ? { ...car, price: newPrice } : car
        )
      );
    } catch (err: any) {
      alert("Error updating price: " + err.message);
    }
  };

  if (isAuthorized === null || loading) return <p>Loading cars...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="allcars-container">
      <h1>Car List</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id} className="allcars-details">
            <p>
              <strong>Brand:</strong> {car.brand}, <strong>Model:</strong> {car.model}, 
              <strong> Year:</strong> {car.year}, <strong>License Plate:</strong> {car.licensePlate}, 
              <strong>Price:</strong> €{car.price}
            </p>
            <p>
              <strong>Status:</strong> 
              <span className={`allcars-status-${car.status}`}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </span>, 
              <strong>Available:</strong> {car.available ? "Yes" : "No"}
            </p>
            {car.status === "active" && (
              <div className="allcars-button-container">
                <button className="allcars-button retire" onClick={() => handleRetireCar(car.id)}>
                  Retire the Car
                </button>
                <button
                  className="allcars-button"
                  onClick={() => handleToggleAvailability(car.id, car.available)}
                >
                  Mark {car.available ? "Unavailable" : "Available"}
                </button>
                <button
                  className="allcars-button"
                  onClick={() => {
                    const newPrice = prompt("Enter new price:", car.price.toString());
                    if (newPrice !== null && !isNaN(Number(newPrice))) {
                      handleUpdatePrice(car.id, Number(newPrice));
                    } else {
                      alert("Invalid price entered.");
                    }
                  }}
                >
                  Update Price
                </button>
              </div>
            )}
            <button
              className="allcars-button"
              onClick={() => (window.location.href = `/searchrentbycar?license=${car.licensePlate}`)}
            >
              Show Rentals
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarList;
