import React, { useEffect, useState } from "react";
import api from "../services/api";
import BatteryChart from "./BatteryChart";
import DroneStatusChart from "./DroneStatusChart";
import PdfReport from "./PdfReport";

const Dashboard: React.FC = () => {
    const [owners, setOwners] = useState<{ id: number; name: string }[]>([]);
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [drones, setDrones] = useState<any[]>([]);
    const [batteryLogs, setBatteryLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await api.get("/api/owners");
                setOwners(response.data || []);
                if (response.data.length > 0) {
                    setOwnerId(response.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching owners:", error);
                setError("Failed to fetch owners.");
            }
        };
        fetchOwners();
    }, []);

    useEffect(() => {
        if (!ownerId) return;
        const fetchDrones = async () => {
            try {
                const response = await api.get(`/api/owners/${ownerId}/drones`);
                setDrones(response.data || []);
            } catch (error) {
                console.error("Error fetching drones:", error);
                setError("Failed to fetch drones.");
            }
        };
        fetchDrones();
    }, [ownerId]);

    const fetchReport = async () => {
        if (!ownerId || !startTime || !endTime) {
            alert("⚠️ Please enter all fields to fetch the report.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                `/api/report?ownerId=${ownerId}&startTime=${encodeURIComponent(
                    startTime
                )}&endTime=${encodeURIComponent(endTime)}`
            );
            setBatteryLogs(response.data.batteryLogs || []);
        } catch (error) {
            console.error("Error fetching battery logs:", error);
            setError("Failed to fetch report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">📊 Drone Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md grid gap-4">
                <div>
                    <label className="text-gray-700 font-medium">Select Owner</label>
                    <select
                        value={ownerId ?? ""}
                        onChange={(e) => setOwnerId(Number(e.target.value))}
                        className="mt-2 p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-700 font-medium">Start Time</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="mt-2 p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-gray-700 font-medium">End Time</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="mt-2 p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    onClick={fetchReport}
                    className="bg-blue-500 text-white font-medium p-3 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Fetching..." : "🔍 Fetch Report"}
                </button>

                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BatteryChart drones={drones} />
                <DroneStatusChart drones={drones} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <PdfReport drones={drones} batteryLogs={batteryLogs} />
            </div>
        </div>
    );
};

export default Dashboard;
