import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import "../components/Signup.css";

const SignupPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Email and password are required!");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }

        try {
            const response = await signup(formData.email.trim().toLowerCase(), formData.password);
            console.log("Signup successful:", response);
            alert("Signup successful! Redirecting to login...");
            navigate("/login");
        } catch (error) {
            console.error("Signup error:", error);

            let errorMsg = "Signup failed!";

            if (error.response?.status === 400) {
                errorMsg = error.response.data?.message || "Invalid email or password";
            } else if (error.response?.status === 500) {
                errorMsg = error.response.data?.message || "Server error - please try again";
            } else if (error.message === "Network Error") {
                errorMsg = "Network error - check your connection and backend URL";
            } else if (error.message.includes("CORS")) {
                errorMsg = "CORS error - backend not accessible";
            } else {
                errorMsg = error.response?.data?.message || error.message || "Signup failed!";
            }

            alert(errorMsg);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Create Account</h2>
                <p className="signup-subtitle">Start tracking your attendance in seconds.</p>

                <form onSubmit={handleSubmit}>
                    <div className="signup-input-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="signup-input-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="signup-btn">Signup</button>
                </form>

                <p className="signup-login-link">
                    <Link to="/login">Already have an account? Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
