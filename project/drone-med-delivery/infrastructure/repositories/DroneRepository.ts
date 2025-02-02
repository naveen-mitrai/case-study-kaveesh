import pool from "../../config/db";
import { Drone } from "../../domain/Drone";
import { cacheBatteryAudit, getCachedBatteryAudits } from "../../cache/BatteryCache";

export const registerDrone = async (
    model: string,
    weightLimit: number,
    batteryCapacity: number,
    ownerId: string,
    currentLatitude: number,
    currentLongitude: number
): Promise<Drone> => {
    const connection = await pool.getConnection();

    try {
        const [owner]: any = await connection.query(
            `SELECT id FROM owners WHERE id = ?`,
            [ownerId]
        );

        if (owner.length === 0) {
            throw new Error(`❌ Owner with ID ${ownerId} does not exist.`);
        }

        const batteryLevel = 100;
        const status = "IDLE";

        await connection.query(
            `INSERT INTO drones (model, weight_limit, battery_capacity, battery_level, status, current_latitude, current_longitude, owner_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [model, weightLimit, batteryCapacity, batteryLevel, status, currentLatitude, currentLongitude, ownerId]
        );

        return { model, weightLimit, batteryCapacity, batteryLevel, status, currentLatitude, currentLongitude, ownerId };
    } catch (error) {
        console.error(`❌ Error registering drone:`, error);
        throw error;
    } finally {
        connection.release();
    }
};

export const updateDroneStatus = async (droneId: number, status: string): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`UPDATE drones SET status = ? WHERE id = ?`, [status, droneId]);
        console.log(`✅ Drone ${droneId} status updated to ${status}`);
    } catch (error) {
        console.error(`❌ Error updating status for Drone ${droneId}:`, error);
    } finally {
        connection.release();
    }
};

export const updateDroneBattery = async (droneId: number, newBatteryLevel: number): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query(`SELECT battery_level FROM drones WHERE id = ?`, [droneId]);

        if (rows.length === 0) {
            console.error(`❌ Drone ${droneId} not found!`);
            return;
        }

        const oldBatteryLevel = rows[0].battery_level;
        await connection.query(`UPDATE drones SET battery_level = ? WHERE id = ?`, [newBatteryLevel, droneId]);
        await cacheBatteryAudit(droneId, oldBatteryLevel, newBatteryLevel);

        console.log("🚀 Cache After Update:", JSON.stringify(getCachedBatteryAudits(), null, 2));
    } catch (error) {
        console.error(`❌ Error updating battery for Drone ${droneId}:`, error);
    } finally {
        connection.release();
    }
};

export const updateDroneLocation = async (droneId: number, latitude: number, longitude: number): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            `UPDATE drones SET current_latitude = ?, current_longitude = ? WHERE id = ?`,
            [latitude, longitude, droneId]
        );
        console.log(`📍 Drone ${droneId} location updated: (${latitude}, ${longitude})`);
    } catch (error) {
        console.error(`❌ Error updating location for Drone ${droneId}:`, error);
    } finally {
        connection.release();
    }
};

export const getAvailableDrones = async (): Promise<any[]> => {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query(
            `SELECT id, model, weight_limit AS weightLimit, battery_capacity AS batteryCapacity, 
            battery_level AS batteryLevel, status, current_latitude AS currentLatitude, 
            current_longitude AS currentLongitude, owner_id AS ownerId
            FROM drones WHERE status = 'IDLE' AND battery_level > 25`
        );
        return rows;
    } catch (error) {
        console.error("❌ Error fetching available drones:", error);
        throw error;
    } finally {
        connection.release();
    }
};

export const getDronesByOwner = async (ownerId: number): Promise<any[]> => {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query(`SELECT * FROM drones WHERE owner_id = ?`, [ownerId]);
        return rows;
    } catch (error) {
        console.error(`❌ Error fetching drones for owner ${ownerId}:`, error);
        throw error;
    } finally {
        connection.release();
    }
};
