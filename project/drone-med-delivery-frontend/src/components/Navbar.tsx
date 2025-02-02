import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <ul className="flex justify-center space-x-6">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/register-drone">Register Drone</Link></li>
                <li><Link to="/order-medication">Order Medication</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
