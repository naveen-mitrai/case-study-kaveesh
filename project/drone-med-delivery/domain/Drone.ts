export interface Drone {
    model: string;
    weightLimit: number;
    batteryCapacity: number;
    batteryLevel: number;
    status: string;
    currentLatitude: number;
    currentLongitude: number;
    ownerId: string;
}
