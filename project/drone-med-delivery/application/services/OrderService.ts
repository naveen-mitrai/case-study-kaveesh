import { getMedicationWithPharmacy } from "../../infrastructure/repositories/MedicationRepository";
import { getAvailableDrones, updateDroneStatus, updateDroneBattery, updateDroneLocation } from "../../infrastructure/repositories/DroneRepository";
import { createOrder, updateOrderStatus } from "../../infrastructure/repositories/OrderRepository";
import { calculateDistance } from "../../utils/distanceUtils";
import { BASE_LOCATION, BATTERY_CONSUMPTION_PER_KM } from "../../config/constants";
import { simulateDroneMovement } from "./DroneSimulationService";

export const placeOrder = async (medicationId: string, dropLat: number, dropLon: number, customerId: string) => {

    const medication = await getMedicationWithPharmacy(medicationId);
    if (!medication) throw new Error("Medication not available");

    const pharmacyLat = medication.store_latitude;
    const pharmacyLon = medication.store_longitude;

    const distanceToPharmacy = calculateDistance(BASE_LOCATION.latitude, BASE_LOCATION.longitude, pharmacyLat, pharmacyLon);
    const distanceToDrop = calculateDistance(pharmacyLat, pharmacyLon, dropLat, dropLon);
    const distanceToBase = calculateDistance(dropLat, dropLon, BASE_LOCATION.latitude, BASE_LOCATION.longitude);
    const totalDistance = distanceToPharmacy + distanceToDrop + distanceToBase;

    const availableDrones = await getAvailableDrones();
    const requiredBattery = totalDistance * BATTERY_CONSUMPTION_PER_KM;

    const selectedDrone = availableDrones.find(drone =>
        drone.weightLimit >= medication.weight &&
        drone.batteryLevel >= requiredBattery
    );

    if (!selectedDrone) throw new Error("No available drone with sufficient battery");

    const orderId = await createOrder(medicationId, customerId, selectedDrone.id, dropLat, dropLon);

    simulateDroneMovement(selectedDrone, pharmacyLat, pharmacyLon, dropLat, dropLon, orderId);

    return { orderId, droneId: selectedDrone.id };
};
