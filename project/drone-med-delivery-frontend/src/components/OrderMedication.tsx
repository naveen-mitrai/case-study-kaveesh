import React, { useState, useEffect } from "react";
import api from "../services/api";

const OrderMedication: React.FC = () => {
    const [medications, setMedications] = useState([]);
    const [order, setOrder] = useState({ medicationId: "", dropLat: "", dropLon: "", customerId: "" });

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await api.get("/api/medications");
                setMedications(response.data);
            } catch (error) {
                console.error("Error fetching medications:", error);
            }
        };
        fetchMedications();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/drones/orders", order);
            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4">Order Medication</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="medicationId" value={order.medicationId} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Medication</option>
                    {medications.map((med: any) => (
                        <option key={med.id} value={med.id}>{med.name}</option>
                    ))}
                </select>
                <input type="text" name="dropLat" placeholder="Drop Latitude" value={order.dropLat} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="dropLon" placeholder="Drop Longitude" value={order.dropLon} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="customerId" placeholder="Customer ID" value={order.customerId} onChange={handleChange} className="w-full p-2 border rounded" required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Place Order</button>
            </form>
        </div>
    );
};

export default OrderMedication;
