import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Model.css';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  photoPath: string;
  price: number;
  available: boolean;
}

function CarSearch() {
  const [cars, setCars] = useState<Car[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:8080/cars/all-cars");
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
        setCars(Array.from(uniqueCarsMap.values()));
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Error fetching cars.");
      }
    };

    fetchCars();
  }, []);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  // Sort and filter cars based on selected order, category, and availability
  const filteredCars = cars.filter(car => {
    return (selectedCategory === "all" || car.category === selectedCategory) && car.available;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div className="car-search">
      <div className="header">
        <h1>Our Vehicles</h1>
        <h2>We offer a big range in cars, with the best safety standards of the market.
          Do you want a performance car? You can rent a fast <span className="highlight">ferrari</span>! Do you want an eco car? We rent these cars too!
        </h2>
        <div className="filters">
          <label htmlFor="filter">Filter by Group: </label>
          <select id="filter" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">All</option>
            <option value="Small">Small</option>
            <option value="Eco">Eco</option>
            <option value="Family">Family</option>
            <option value="Performance">Performance</option>
          </select>
          <div className="sorting">
            <label htmlFor="sort">Sort by Price: </label>
            <select id="sort" value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      <div className="car-results">
        {sortedCars.length === 0 ? (
          <p>No cars available.</p>
        ) : (
          sortedCars.map((car) => (
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
                    onClick={() => navigate('/cars')} // Navigate to cars page
                  >
                    Check dates
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CarSearch;
