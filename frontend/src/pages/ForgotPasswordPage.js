import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/api";
import "../components/ForgotPassword.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await requestPasswordReset(email.trim().toLowerCase());
            alert(response.data?.message || "If your account exists, a reset link was sent.");
            navigate("/login");
        } catch (error) {
            const status = error.response?.status;
            const backendMessage = error.response?.data?.message;

            if (status === 404) {
                alert("Password reset route is not available on current backend. Please run latest backend or redeploy backend.");
            } else if (!error.response && error.message?.includes("REACT_APP_BACKEND_URL")) {
                alert("Frontend is not configured with REACT_APP_BACKEND_URL on Vercel. Set it to your backend URL and redeploy the frontend.");
            } else {
                alert(backendMessage || "Failed to send reset email. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <h2>Forgot Password</h2>
                <p className="forgot-subtitle">Enter your email to receive a password reset link.</p>

                <form onSubmit={handleResetPassword} className="forgot-form">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="forgot-input"
                    />

                    <button
                        type="submit"
                        className="forgot-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p className="forgot-back-link">
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
