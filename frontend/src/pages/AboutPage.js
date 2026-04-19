import React from "react";
import "../components/about.css";

const AboutPage = () => {
    return (
        <div className="about-container">
            <section className="about-hero">
                <p className="about-kicker">Student attendance made simple</p>
                <h1>About Self-Attendance Tracker</h1>
                <p className="about-lead">
                    A clean, responsive web app for students to track attendance, manage subjects,
                    and understand progress without the clutter of spreadsheets.
                </p>

                <div className="about-highlights" aria-label="key highlights">
                    <div className="about-highlight-card">
                        <span className="about-highlight-number">1</span>
                        <span className="about-highlight-label">Dashboard</span>
                    </div>
                    <div className="about-highlight-card">
                        <span className="about-highlight-number">2</span>
                        <span className="about-highlight-label">Calendar</span>
                    </div>
                    <div className="about-highlight-card">
                        <span className="about-highlight-number">3</span>
                        <span className="about-highlight-label">Insights</span>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <h2>Features</h2>
                <div className="about-grid">
                    <div className="about-card">Calendar view with color-coded attendance for quick tracking.</div>
                    <div className="about-card">Subject-wise management so each class stays organized.</div>
                    <div className="about-card">Live stats for total, present, absent, and percentage.</div>
                    <div className="about-card">Easy add/delete actions with a simple student-friendly workflow.</div>
                    <div className="about-card">Responsive layout with a pink-blue theme that works on mobile.</div>
                    <div className="about-card">Secure login, signup, and password reset support.</div>
                </div>
            </section>

            <section className="about-section about-dual">
                <div>
                    <h2>How It Works</h2>
                    <ol className="about-list">
                        <li>Sign up and log in to your account.</li>
                        <li>Add your subjects and start marking attendance.</li>
                        <li>Use the calendar to review each day clearly.</li>
                        <li>Check progress and plan better for upcoming classes.</li>
                    </ol>
                </div>

                <div>
                    <h2>Why Use This</h2>
                    <p>
                        It removes the friction of manual attendance tracking and gives you a clearer,
                        more visual way to stay on top of your academics.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
