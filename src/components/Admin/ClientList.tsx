import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientsList.css";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  idCard: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthorization();
    fetchClients();
  }, []);

  const checkAuthorization = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/userinfo", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Authorization failed");
      }

      const data = await response.json();
      if (data.role !== "ROLE_ADMIN") {
        navigate("/not-found");
      }
    } catch (error) {
      console.error("Authorization error:", error);
      navigate("/not-found");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/clients/all", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched clients data:", data);
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const viewReservations = (client: Client) => {
    const searchParam = client.phone || client.idCard; // paei sto search me ena apo ta 2 bebaia panta yparxoyn kai ta 2 
    navigate(`/searchbycustom?search=${searchParam}`);
  };

  return (
    <div className="client-list-container">
      <h1>Clients</h1>
      <ul className="client-list">
        {clients.map((client) => (
          <li key={client.id} className="client-item">
            <div className="client-info">
              <span>Name: {client.firstName} {client.lastName}</span>
              <span>Telephone: {client.phone}</span>
              <span>ID Card: {client.idCard}</span>
            </div>
            <div className="client-actions">
              <button
                onClick={() => viewReservations(client)}
                className="viewrent-button"
              >
                Show Rentals
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
