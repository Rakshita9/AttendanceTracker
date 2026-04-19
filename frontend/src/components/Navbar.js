import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthRoute = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(location.pathname);

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">Self Attendance Tracker</div>

            <div className="nav-right">
                <Link to="/" className="nav-link">Home</Link>
                {isAuthenticated && <Link to="/dashboard" className="nav-link">Subjects</Link>}

                <Link to="/about" className="nav-link">About</Link>

                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                ) : !isAuthRoute ? (
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                ) : null}
            </div>
        </nav>
    );
};

export default Navbar;
