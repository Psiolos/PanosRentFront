import React, { useEffect, useState } from 'react';
import './UserInfo.css';

interface UserInfo {
  username: string;
  points: number;
  firstName: string;
  lastName: string;
  phone: string;
  clientId: number;
  idCard: string;
}

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedInfo, setUpdatedInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/auth/userinfo/details', {
      method: 'GET',
      credentials: 'include', // Authenticating from cookies
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserInfo(data);
        setUpdatedInfo(data); // Initialize the update state with the current user data
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedInfo((prevInfo) => ({
      ...prevInfo!,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (updatedInfo) {
      fetch(`http://localhost:8080/clients/update/${userInfo?.clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      })
        .then((response) => {
          if (response.ok) {
            setUserInfo(updatedInfo); 
            setIsEditing(false); 
          } else {
            throw new Error('Failed to update user info');
          }
        })
        .catch((error) => setError(error.message));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="userdashinfo-container">
      <h1 className="userdashinfo-header">User Information</h1>
      {userInfo && (
        <div className="userdashinfo-details">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={updatedInfo.firstName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={updatedInfo.lastName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={updatedInfo.phone}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                ID Card:
                <input
                  type="text"
                  name="idCard"
                  value={updatedInfo.idCard}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          ) : (
            <div>
              <p><strong>Username:</strong> {userInfo.username}</p>
              <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
              <p><strong>Phone:</strong> {userInfo.phone}</p>
              <p><strong>ID Card:</strong> {userInfo.idCard}</p>
              <p><strong>Points:</strong> {userInfo.points}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
