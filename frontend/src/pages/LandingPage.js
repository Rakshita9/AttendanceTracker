import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import homeHeroImage from "../homejpg.jpg";
import "./LandingPage.css";

const LandingPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("token")));

    useEffect(() => {
        const syncAuthState = () => {
            setIsAuthenticated(Boolean(localStorage.getItem("token")));
        };

        window.addEventListener("authChanged", syncAuthState);
        window.addEventListener("storage", syncAuthState);

        return () => {
            window.removeEventListener("authChanged", syncAuthState);
            window.removeEventListener("storage", syncAuthState);
        };
    }, []);

    return (
        <div className="landing-page">
            <section className="landing-hero">
                <div className="landing-hero-bg" aria-hidden="true">
                    <img src={homeHeroImage} alt="" className="landing-hero-bg-image" />
                </div>
                <div className="landing-hero-overlay" aria-hidden="true"></div>

                <div className="landing-copy-block">
                    <p className="landing-kicker">Attendance tracking for students</p>
                    <h1>Track your classes without spreadsheets.</h1>
                    <p className="landing-copy">
                        Keep subjects, attendance, and stats in one place with a simple dashboard built for daily use.
                    </p>

                    <div className="landing-meta" aria-label="key benefits">
                        <span className="landing-chip">Fast setup</span>
                        <span className="landing-chip">Clean dashboard</span>
                        <span className="landing-chip">Attendance insights</span>
                    </div>

                    <div className="landing-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="landing-primary">Go to Subjects</Link>
                                <Link to="/dashboard" className="landing-secondary">View Dashboard</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="landing-primary">Get Started</Link>
                                <Link to="/login" className="landing-secondary">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
