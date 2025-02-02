import { Request, Response } from "express";
import { generateReport } from "../../application/services/ReportService";

export const getReport = async (req: Request, res: Response) => {
    try {
        const { ownerId, startTime, endTime } = req.query;

        if (!ownerId || !startTime || !endTime) {
            return res.status(400).json({ error: "Missing required query parameters." });
        }

        const report = await generateReport(Number(ownerId), String(startTime), String(endTime));

        return res.json(report);
    } catch (error) {
        console.error("❌ Error generating report:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
