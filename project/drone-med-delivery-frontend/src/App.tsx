import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DroneRegister from "./components/DroneRegister";
import OrderMedication from "./components/OrderMedication";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<h1 className="text-center text-3xl mt-6">Welcome to Drone Delivery</h1>} />
                <Route path="/register-drone" element={<DroneRegister />} />
                <Route path="/order-medication" element={<OrderMedication />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
};

export default App;
