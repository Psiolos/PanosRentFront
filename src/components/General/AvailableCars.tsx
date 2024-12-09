import React, { useState } from 'react';
import RentForm from '../RentForm';
import './AvailableCars.css'; 

interface Car {
    id: number;
    mark: string;
    model: string;
    year: number;
}

const AvailableCars: React.FC = () => {
    const [availableCars, setAvailableCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const searchAvailableCars = async (startDate: string, endDate: string) => {
        setLoading(true);
        console.log("Searching cars from", startDate, "to", endDate);
        try {
            const response = await fetch(`http://localhost:8080/rent/available-cars?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) throw new Error('Failed to fetch available cars');
            const data: Car[] = await response.json();
            console.log("Available cars:", data);
            setAvailableCars(data);
        } catch (error) {
            console.error('Error fetching available cars:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Rent a Car</h2>
            <RentForm onSearch={searchAvailableCars} />
            
            {loading && <p>Loading available cars...</p>}
            
            <div className="available-cars">
                {availableCars.length > 0 ? (
                    <ul className="car-list">
                        {availableCars.map((car) => (
                            <li key={car.id} className="car-item">
                                {car.mark} {car.model} ({car.year})
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>No available cars for the selected dates.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableCars;
