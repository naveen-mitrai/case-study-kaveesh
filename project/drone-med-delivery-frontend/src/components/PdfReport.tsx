import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfReportProps {
    drones: any[];
    batteryLogs?: any[];
}

const PdfReport: React.FC<PdfReportProps> = ({ drones, batteryLogs = [] }) => {
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Drone Report", 14, 20);

        const droneData = Array.isArray(drones) ? drones : [];

        autoTable(doc, {
            startY: 30,
            head: [["Drone ID", "Model", "Status", "Battery Level (%)"]],
            body: droneData.map((drone) => [
                drone.id,
                drone.model,
                drone.status,
                drone.battery_level,
            ]),
        });

        const finalY = (doc as any).lastAutoTable?.finalY || 40;

        const batteryData = Array.isArray(batteryLogs) ? batteryLogs : [];

        if (batteryData.length > 0) {
            doc.text("Battery Level Logs", 14, finalY + 10);
            autoTable(doc, {
                startY: finalY + 20,
                head: [["Drone ID", "Old Level", "New Level", "Timestamp"]],
                body: batteryData.map((log) => [
                    log.drone_id,
                    log.old_battery_level,
                    log.new_battery_level,
                    log.updated_at,
                ]),
            });
        } else {
            doc.text("No Battery Logs Available", 14, finalY + 10);
        }

        doc.save("drone_report.pdf");
    };

    return (
        <button
            onClick={generatePDF}
            className="bg-green-500 text-white p-2 mt-4 rounded w-full hover:bg-green-700"
        >
            Download PDF Report
        </button>
    );
};

export default PdfReport;
