import { Request, Response } from "express";
import { addOwner, fetchOwners } from "../../application/services/OwnerService";

export const createOwner = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const owner = await addOwner(name);
        res.status(201).json(owner);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getOwnersList = async (req: Request, res: Response) => {
    try {
        const owners = await fetchOwners();
        res.status(200).json(owners);
    } catch (error) {
        console.error("❌ Error fetching owners:", error);
        res.status(500).json({ error: "Failed to fetch owners." });
    }
};
