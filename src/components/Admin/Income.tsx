import React, { useState, useEffect } from "react";
import "./Income.css";

const Income: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");
  const [totalIncome, setTotalIncome] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && startDate && endDate) {
      fetchTotalIncome();
    }
  }, [startDate, endDate, category, isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/userinfo", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.role === "ROLE_ADMIN" && data.username === "admin") {
          setIsAuthenticated(true);
        } else {
          window.location.href = "/not-found"; 
        }
      } else {
        window.location.href = "/not-found"; 
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      window.location.href = "/not-found"; 
    }
  };

  const fetchTotalIncome = async () => {
    try {
      const response = await fetch("http://localhost:8080/reservations/all",{
        credentials: "include",
    });
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();

      const total = data
        .filter((reservation: any) => {
          const isConfirmed = reservation.status === "confirmed";
          const isInDateRange =
            reservation.startDate >= startDate &&
            reservation.startDate <= endDate;
          const isInCategory =
            category === "all" || reservation.car.category === category;

          return isConfirmed && isInDateRange && isInCategory;
        })
        .reduce((acc: number, reservation: any) => acc + parseFloat(reservation.totalPrice), 0);

      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  return isAuthenticated ? (
    <div className="income-container">
      <h1 className="income-title">Total Income</h1>
      <div className="income-filters">
        <label className="income-label">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="income-input"
          />
        </label>
        <label className="income-label">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="income-input"
          />
        </label>
      </div>
      <div className="income-filters">
        <label className="income-label">
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="income-select"
          >
            <option value="all">All</option>
            <option value="Small">Small</option>
            <option value="Eco">Eco</option>
            <option value="Performance">Performance</option>
            <option value="Family">Family</option>
          </select>
        </label>
      </div>
      <h2 className="income-total">Income: €{totalIncome}</h2>
    </div>
  ) : null;
};

export default Income;
