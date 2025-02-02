import React, { useEffect, useState } from "react";
import api from "../services/api";

const DroneRegister: React.FC = () => {
    const [owners, setOwners] = useState<{ id: number; name: string }[]>([]);
    const [drone, setDrone] = useState({
        model: "",
        weightLimit: "",
        batteryCapacity: "",
        ownerId: "",
        currentLatitude: "",
        currentLongitude: "",
    });

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await api.get("/api/owners");
                setOwners(response.data || []);
                if (response.data.length > 0) {
                    setDrone((prev) => ({ ...prev, ownerId: response.data[0].id }));
                }
            } catch (error) {
                console.error("Error fetching owners:", error);
            }
        };

        fetchOwners();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDrone({ ...drone, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/drones/register", { ...drone, ownerId: Number(drone.ownerId) });
            alert("✅ Drone registered successfully!");

            // ✅ Reset form fields after successful registration
            setDrone({
                model: "",
                weightLimit: "",
                batteryCapacity: "",
                ownerId: owners.length > 0 ? String(owners[0].id) : "",
                currentLatitude: "",
                currentLongitude: "",
            });
        } catch (error) {
            console.error("Error registering drone:", error);
            alert("❌ Failed to register drone.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800">🚁 Register a Drone</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="model"
                    placeholder="Model"
                    value={drone.model}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="number"
                    name="weightLimit"
                    placeholder="Weight Limit (kg)"
                    value={drone.weightLimit}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="number"
                    name="batteryCapacity"
                    placeholder="Battery Capacity (%)"
                    value={drone.batteryCapacity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="number"
                    name="currentLatitude"
                    placeholder="Latitude"
                    value={drone.currentLatitude}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="number"
                    name="currentLongitude"
                    placeholder="Longitude"
                    value={drone.currentLongitude}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />

                {/* Owner Selection Dropdown */}
                <div>
                    <label className="text-gray-700 font-medium">Select Owner</label>
                    <select
                        name="ownerId"
                        value={drone.ownerId}
                        onChange={handleChange}
                        className="mt-2 p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        {owners.length > 0 ? (
                            owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                No owners available
                            </option>
                        )}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    🚀 Register Drone
                </button>
            </form>
        </div>
    );
};

export default DroneRegister;
