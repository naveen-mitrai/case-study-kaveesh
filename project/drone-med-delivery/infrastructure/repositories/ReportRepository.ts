import pool from "../../config/db";

export const getDronesByOwner = async (ownerId: number) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT id, model, status, battery_level, current_latitude, current_longitude 
             FROM drones WHERE owner_id = ?`,
            [ownerId]
        );
        return rows;
    } catch (error) {
        console.error("❌ Error fetching drones by owner:", error);
        throw error;
    } finally {
        connection.release();
    }
};

export const getBatteryLogsByTimeRange = async (ownerId: number, startTime: string, endTime: string) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await pool.query(
            `SELECT ba.drone_id, ba.old_battery_level, ba.new_battery_level, ba.updated_at
         FROM drone_battery_audit ba  
         JOIN drones d ON ba.drone_id = d.id
         WHERE d.owner_id = ? AND ba.updated_at BETWEEN ? AND ?
         ORDER BY ba.updated_at ASC`,
            [ownerId, startTime, endTime]
        );
        return rows;
    } catch (error) {
        console.error("❌ Error fetching battery logs:", error);
        throw error;
    } finally {
        connection.release();
    }
};
