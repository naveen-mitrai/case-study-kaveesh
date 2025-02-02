import { Request, Response } from "express";
import { addDrone, fetchDronesByOwner } from "../../application/services/DroneService";

export const registerDrone = async (req: Request, res: Response) => {
    try {
        const { model, weightLimit, batteryCapacity, ownerId, currentLatitude, currentLongitude } = req.body;
        const drone = await addDrone(model, weightLimit, batteryCapacity, ownerId, currentLatitude, currentLongitude);
        res.status(201).json(drone);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getDronesForOwner = async (req: Request, res: Response)  => {
    try {
        const { ownerId } = req.params;
        if (!ownerId) {
            return res.status(400).json({ error: "Owner ID is required" });
        }

        const drones = await fetchDronesByOwner(Number(ownerId));
        return res.status(200).json(drones);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
