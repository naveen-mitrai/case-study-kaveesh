import { Request, Response } from "express";
import { fetchMedications } from "../../application/services/MedicationService";

export const getMedicationList = async (req: Request, res: Response) => {
    try {
        const medications = await fetchMedications();
        return res.status(200).json(medications);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
