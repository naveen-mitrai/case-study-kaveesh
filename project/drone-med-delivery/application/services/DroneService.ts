import { registerDrone, getDronesByOwner } from "../../infrastructure/repositories/DroneRepository";
import { Drone } from "../../domain/Drone";

export const addDrone = async (
    model: string,
    weightLimit: number,
    batteryCapacity: number,
    ownerId: string,
    currentLatitude: number,
    currentLongitude: number
): Promise<Drone> => {
    return await registerDrone(model, weightLimit, batteryCapacity, ownerId, currentLatitude, currentLongitude);
};

export const fetchDronesByOwner = async (ownerId: number): Promise<any[]> => {
    return await getDronesByOwner(ownerId);
};
