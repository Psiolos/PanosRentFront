import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo/rentallogo.png";
import { useState, useEffect } from "react";
import './Navbar.css';

function Navbar() {
  const [nav, setNav] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const openNav = () => {
    setNav(!nav);
  };


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/userinfo", {
          credentials: "include",
        });
        if (response.status === 403 || response.status === 401) {
          setRole(null); 
        } else if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      }
    };

    fetchUserRole();
  }, []);

  const handleSignIn = () => {
    navigate("/login");  
    window.location.reload();  
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setRole(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  return (
    <>
      <nav>
        {/* Desktop */}
        <div className="navbar">
          <div className="navbar__img">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" />
            </Link>
          </div>
          <ul className="navbar__links">
            <li>
              <Link className="home-link" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="rent-link" to="/cars">
                Rent Now!
              </Link>
            </li>
            <li>
              <Link className="vehicle-link" to="/models">
                Vehicle Models
              </Link>
            </li>
            <li>
              <Link className="contact-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <div className="navbar__buttons">
            {role === "ROLE_ADMIN" && (
              <>
                <Link className="navbar__buttons__button" to="/admin">
                  Dashboard
                </Link>
                <button
                  className="navbar__buttons__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
            {role === "ROLE_CLIENT" && (
              <>
                <Link className="navbar__buttons__button" to="/userdash">
                  Profile 
                </Link>
                <button
                  className="navbar__buttons__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
            {!role && (
              <>
                 <button
                className="navbar__buttons__sign-in"
                onClick={handleSignIn} 
              >
                Sign In
              </button>
                <Link className="navbar__buttons__register" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile 
        <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
          <div onClick={openNav} className="mobile-navbar__close">
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className="mobile-navbar__links">
            <li>
              <Link onClick={openNav} to="/">
                Home
              </Link>
            </li>
          
          </ul>
        </div>
        <div className="mobile-hamb" onClick={openNav}>
          <i className="fa-solid fa-bars"></i>
        </div> */}
      </nav>
    </>
  );
}

export default Navbar;
