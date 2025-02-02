export type Drone = {
    id: number;
    model: string;
    status: string;
    batteryLevel: number;
    currentLatitude: number;
    currentLongitude: number;
};

export type Medicine = {
    id: number;
    name: string;
    weight: number;
    code: string;
    storeLatitude: number;
    storeLongitude: number;
};
