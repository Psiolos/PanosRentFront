import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/CarBox.css";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  photoPath: string;
  price: number;
  available: boolean;
  fuelConsumption: number;
  horsepower: number;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  idCard: string;
  phone: string;
}

function MemberRent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [group, setGroup] = useState<string>("All");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const location = useLocation();
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const start = queryParams.get("startDate");
    const end = queryParams.get("endDate");

    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }

    fetchUserDetails();
  }, [location]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/userinfo/details", {
        method: 'GET', 
        credentials: 'include', // edw to authenticate apo cookie
      })
      if (!response.ok) {
        throw new Error("Failed to fetch user details.");
      }
      const data = await response.json();
      setUserDetails({
        firstName: data.firstName,
        lastName: data.lastName,
        idCard: data.idCard,
        phone: data.phone,
      });
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Please add both start and end dates.");
      return;
    }
    setError("");
    setSearchSubmitted(true);

    try {
      const response = await fetch(
        `http://localhost:8080/reservations/available-cars?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const uniqueCarsMap = new Map<string, Car>();
      data.forEach((car: Car) => {
        const key = `${car.brand.trim().toLowerCase()}-${car.model.trim().toLowerCase()}`;
        if (!uniqueCarsMap.has(key)) {
          uniqueCarsMap.set(key, car);
        }
      });

      const uniqueCars = Array.from(uniqueCarsMap.values());
      setCars(uniqueCars);
      setFilteredCars(uniqueCars);
    } catch (error) {
      console.error("Error fetching available cars:", error);
      setError("Error fetching available cars.");
    }
  };

  const handleGroupChange = (selectedGroup: string) => {
    setGroup(selectedGroup);
    const filtered = cars.filter((car) => {
      if (selectedGroup === "All") {
        return true;
      } else if (selectedGroup === "Eco") {
        return car.fuelConsumption < 6 || car.category === "Eco";
      } else if (selectedGroup === "Performance") {
        return car.horsepower > 200 || car.category === "Performance";
      } else {
        return car.category === selectedGroup;
      }
    });
    setFilteredCars(filtered);
  };

  return (
    <div className="car-search">
      <h1>Member Rental Page</h1>
      {userDetails && (
        <div className="user-details">
          <p>
            <strong>First Name:</strong> {userDetails.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {userDetails.lastName}
          </p>
          <p>
            <strong>ID Card:</strong> {userDetails.idCard}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails.phone}
          </p>
        </div>
      )}

      <div className="date-picker">
        <label> Start Date </label>
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

        <label> End Date </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || today}
        />

        <button onClick={handleSearch} className="date-search-button">Search</button>

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="group-filter">
        <label> Car Group : </label>
        <select value={group} onChange={(e) => handleGroupChange(e.target.value)}>
          <option value="All">All</option>
          <option value="Eco">Eco</option>
          <option value="Small">Small</option>
          <option value="Performance">Performance</option>
          <option value="Family">Family</option>
        </select>
      </div>

      <div className="car-results">
        {searchSubmitted && filteredCars.length === 0 && startDate && endDate && (
          <p>No available cars found for the selected dates.</p>
        )}
        {filteredCars.length > 0 &&
          filteredCars.map((car) => (
            <div key={car.id} className="car-box">
              <div className="car-header">
                <h3 className="car-title">{car.brand} {car.model}</h3>
                <p className="car-group">Group: {car.category}</p>
              </div>
              <div className="car-details">
                <div className="car-image">
                  <img src={`http://localhost:8080/${car.photoPath}`} alt={`${car.brand} ${car.model}`} />
                </div>
                <div className="car-info">
                  <p>Year: {car.year}</p>
                  <p>Price per day: {car.price.toFixed(2)}</p>
                  <button
                    className="book-btn"
                    onClick={() =>
                      navigate(`/memberreservation/${car.id}`, {
                        state: { car, startDate, endDate, userDetails },
                      })
                    }
                  >
                    I want this
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MemberRent;
