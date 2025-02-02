import { getDronesByOwner, getBatteryLogsByTimeRange } from "../../infrastructure/repositories/ReportRepository";
import PDFDocument from "pdfkit";
import fs from "fs";

export const generateReport = async (ownerId: number, startTime: string, endTime: string) => {
    const drones = await getDronesByOwner(ownerId);
    const batteryLogs = await getBatteryLogsByTimeRange(ownerId, startTime, endTime);

    return { drones, batteryLogs };
};

