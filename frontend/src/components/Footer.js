import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <p className="footer-title">Self Attendance Tracker</p>
                <p className="footer-subtitle">Track smarter, stay consistent.</p>
                <p className="footer-copy">&copy; {new Date().getFullYear()} All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;