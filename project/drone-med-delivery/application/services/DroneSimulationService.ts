import { updateDroneStatus, updateDroneBattery, updateDroneLocation } from "../../infrastructure/repositories/DroneRepository";
import { updateOrderStatus } from "../../infrastructure/repositories/OrderRepository";
import { calculateDistance } from "../../utils/distanceUtils";
import { DRONE_SPEED_KM_PER_HOUR, LOCATION_UPDATE_INTERVAL, BASE_LOCATION, BATTERY_CONSUMPTION_PER_KM } from "../../config/constants";
import pool from "../../config/db";

/**
 * Simulates drone movement for an order, from pickup to delivery and back to base.
 */
export const simulateDroneMovement = async (drone, pharmacyLat, pharmacyLon, dropLat, dropLon, orderId) => {
    try {
        console.log(`🚁 Drone ${drone.id} starts journey`);

        // Move to Pharmacy
        console.log(`📦 Drone ${drone.id} going to Pharmacy`);
        await updateDroneStatus(drone.id, "LOADING");
        await moveDrone(drone.id, drone.currentLatitude, drone.currentLongitude, pharmacyLat, pharmacyLon);

        console.log(`📦 Drone ${drone.id} reached Pharmacy, now delivering...`);

        // Move to Customer
        console.log(`🚚 Drone ${drone.id} delivering to Customer`);
        await updateDroneStatus(drone.id, "DELIVERING");
        await moveDrone(drone.id, pharmacyLat, pharmacyLon, dropLat, dropLon);

        console.log(`✅ Drone ${drone.id} reached customer location!`);
        await updateOrderStatus(orderId, "DELIVERED");

        // Return to Base
        console.log(`🏠 Drone ${drone.id} returning to base`);
        await updateDroneStatus(drone.id, "RETURNING");
        await moveDrone(drone.id, dropLat, dropLon, BASE_LOCATION.latitude, BASE_LOCATION.longitude);

        // Reset Drone Status
        console.log(`✅ Drone ${drone.id} completed trip, now IDLE`);
        await updateDroneStatus(drone.id, "IDLE");
    } catch (error) {
        console.error(`❌ ERROR in simulateDroneMovement for Drone ${drone.id}:`, error);
    }
};

/**
 * Moves a drone from a start position to an end position, updating its battery level and location.
 */
export const moveDrone = async (droneId: number, startLat: number, startLon: number, endLat: number, endLon: number) => {
    try {
        const totalDistance = calculateDistance(startLat, startLon, endLat, endLon);
        const totalTimeInSeconds = (totalDistance / DRONE_SPEED_KM_PER_HOUR) * 3600;
        let elapsedTime = 0;

        // ✅ Fetch latest battery level from database
        let [drone] = await pool.query(`SELECT battery_level FROM drones WHERE id = ?`, [droneId]);
        let remainingBattery = drone[0].battery_level;

        console.log(`🚁 Starting moveDrone | Drone ID: ${droneId} | Distance: ${totalDistance.toFixed(2)} km | Estimated Time: ${totalTimeInSeconds.toFixed(2)} sec | Battery: ${remainingBattery}%`);

        while (elapsedTime < totalTimeInSeconds) {
            try {
                console.log(`⏳ Drone ${droneId} Moving | Elapsed: ${elapsedTime.toFixed(2)}/${totalTimeInSeconds.toFixed(2)} sec`);

                // ✅ Stop if battery is critically low (to avoid drone failure)
                if (remainingBattery <= 5) {
                    console.error(`❌ Drone ${droneId} Battery Critical: ${remainingBattery}%. Returning to base.`);
                    await updateDroneStatus(droneId, "LOW_BATTERY");
                    return;
                }

                // ✅ Calculate new drone position
                const progress = elapsedTime / totalTimeInSeconds;
                const newLat = startLat + (endLat - startLat) * progress;
                const newLon = startLon + (endLon - startLon) * progress;

                // ✅ Calculate battery consumption per update cycle
                const distanceCovered = (DRONE_SPEED_KM_PER_HOUR / 3600) * LOCATION_UPDATE_INTERVAL; // km traveled per interval
                const batteryUsed = BATTERY_CONSUMPTION_PER_KM * distanceCovered;
                remainingBattery = Math.max(0, remainingBattery - batteryUsed);

                console.log(`🔋 Battery before update: ${remainingBattery.toFixed(2)}%`);

                // ✅ Update drone location and battery in DB
                await updateDroneLocation(droneId, newLat, newLon);
                await updateDroneBattery(droneId, remainingBattery);

                console.log(`🚁 Drone ${droneId} updated: (${newLat.toFixed(6)}, ${newLon.toFixed(6)}) - Battery: ${remainingBattery.toFixed(2)}%`);

                // ✅ Wait before next update
                await delay(LOCATION_UPDATE_INTERVAL * 1000);
                elapsedTime += LOCATION_UPDATE_INTERVAL;
            } catch (error) {
                console.error(`❌ ERROR inside moveDrone loop for Drone ${droneId}:`, error);
                break;
            }
        }

        console.log(`✅ FINAL Drone ${droneId} reached (${endLat.toFixed(6)}, ${endLon.toFixed(6)}) with ${remainingBattery.toFixed(2)}% battery.`);
        await updateDroneBattery(droneId, remainingBattery);
        await updateDroneLocation(droneId, endLat, endLon);
    } catch (error) {
        console.error(`❌ FATAL ERROR in moveDrone for Drone ${droneId}:`, error);
    }
};
// ✅ Ensure it's a default import
/**
 * Delays execution for a given number of milliseconds.
 */
const delay = (ms: number) => new Promise(resolve => setImmediate(() => setTimeout(resolve, ms)));

