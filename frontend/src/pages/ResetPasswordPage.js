import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import "../components/ForgotPassword.css";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
    const [newPassword, setNewPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Reset token is missing or invalid.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await resetPassword(token, newPassword);
            alert(response.data?.message || "Password reset successful.");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Could not reset password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <h2>Set New Password</h2>
                <p className="forgot-subtitle">Choose a strong new password for your account.</p>

                <form onSubmit={handleSubmit} className="forgot-form">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="forgot-input"
                    />

                    <button type="submit" className="forgot-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                </form>

                <p className="forgot-back-link">
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
