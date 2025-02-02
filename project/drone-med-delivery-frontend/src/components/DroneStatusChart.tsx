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

const DroneStatusChart: React.FC<{ drones: any[] }> = ({ drones }) => {
    const statusCounts = drones.reduce((acc: any, drone: any) => {
        acc[drone.status] = (acc[drone.status] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: "Drones per Status",
                data: Object.values(statusCounts),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">🚁 Drone Status</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default DroneStatusChart;
