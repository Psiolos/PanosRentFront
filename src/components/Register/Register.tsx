import './Register.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tel, setTel] = useState("");
    const [idCard, setIdCard] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                firstName,
                lastName,
                tel: tel,
                idCard,
            }),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert("Registration failed!");
        }
    };

    return (
        <div className="login-page">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="First Name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Last Name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="tel"
                            placeholder="Phone"
                            required
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Identity Card"
                            required
                            value={idCard}
                            onChange={(e) => setIdCard(e.target.value)}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <div className="login-link">
                    <p>Already have an account? <a onClick={() => navigate('/login')}>Login</a></p>
                </div>
                <div className="login-link">
                    <p>Go to Home page! <a onClick={() => { navigate('/'); window.location.reload(); }}>Home</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
