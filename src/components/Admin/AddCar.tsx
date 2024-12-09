import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCar.css';

type Car = {
  brand: string;
  model: string;
  year?: number;
  licensePlate: string;
  category: string;
  isAvailable: boolean;
  price?: number;
  fuelConsumption?: number;
  horsepower?: number;
};

const AddCar: React.FC = () => {
  const [car, setCar] = useState<Car>({
    brand: '',
    model: '',
    licensePlate: '',
    category: '',
    isAvailable: true,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/userinfo', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.role === 'ROLE_ADMIN') {
            setIsAuthorized(true);
          } else {
            navigate('/not-found');
          }
        } else {
          navigate('/not-found');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/not-found');
      }
    };

    checkAuthorization();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setCar((prevCar) => ({
      ...prevCar,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('brand', car.brand);
      formData.append('model', car.model);
      if (car.year) formData.append('year', car.year.toString());
      formData.append('licensePlate', car.licensePlate);
      formData.append('category', car.category);
      formData.append('isAvailable', car.isAvailable.toString());
      if (car.price) formData.append('price', car.price.toString());
      if (car.fuelConsumption) formData.append('fuelConsumption', car.fuelConsumption.toString());
      if (car.horsepower) formData.append('horsepower', car.horsepower.toString());

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch('http://localhost:8080/cars/add', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('Car added successfully!');
        setCar({
          brand: '',
          model: '',
          licensePlate: '',
          category: '',
          isAvailable: true,
        });
        setPhotoFile(null);
      } else {
        alert('Failed to add car. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (isAuthorized === null) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="add-car-form">
      <h2>Add a New Car</h2>
      <div className="form-group">
        <label>Brand:</label>
        <input type="text" name="brand" value={car.brand} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Model:</label>
        <input type="text" name="model" value={car.model} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Year:</label>
        <input type="number" name="year" value={car.year || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>License Plate:</label>
        <input type="text" name="licensePlate" value={car.licensePlate} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Car Group:</label>
        <select name="category" value={car.category} onChange={handleChange} required>
          <option value="" disabled>Select category</option>
          <option value="Small">Small</option>
          <option value="Eco">Eco</option>
          <option value="Performance">Performance</option>
          <option value="Family">Family</option>
        </select>
      </div>
      <div className="form-group">
        <label>Available:</label>
        <input type="checkbox" name="isAvailable" checked={car.isAvailable} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Photo:</label>
        <input type="file" name="photo" onChange={handleFileChange} />
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input type="number" name="price" value={car.price || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Fuel Consumption (L/100km):</label>
        <input type="number" name="fuelConsumption" value={car.fuelConsumption || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Horsepower:</label>
        <input type="number" name="horsepower" value={car.horsepower || ''} onChange={handleChange} />
      </div>
      <button type="submit" className="submit-button">Add Car</button>
    </form>
  );
};

export default AddCar;
