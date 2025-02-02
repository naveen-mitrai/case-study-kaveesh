import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BatteryChart: React.FC<{ drones: any[] }> = ({ drones }) => {
    const chartData = {
        labels: drones.map((drone) => `Drone ${drone.id}`),
        datasets: [
            {
                label: "Battery Level (%)",
                data: drones.map((drone) => drone.battery_level),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: { beginAtZero: true, max: 100 },
        },
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">🔋 Battery Levels</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BatteryChart;
