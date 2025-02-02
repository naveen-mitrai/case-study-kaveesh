import pool from "../../config/db";

export const createOrder = async (
    medicationId: string, customerId: string, droneId: string, dropLat: number, dropLon: number
): Promise<number> => {
    const connection = await pool.getConnection();
    try {
        const [result]: any = await connection.query(
            `INSERT INTO orders (medication_id, customer_id, drone_id, status, drop_latitude, drop_longitude)
             VALUES (?, ?, ?, 'PENDING', ?, ?)`,
            [medicationId, customerId, droneId, dropLat, dropLon]
        );

        return result.insertId;
    } catch (error) {
        console.error(`❌ Error creating order:`, error);
        throw error;
    } finally {
        connection.release();
    }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, orderId]
        );
        console.log(`✅ Order ${orderId} status updated to ${status}`);
    } catch (error) {
        console.error(`❌ Error updating order ${orderId} status:`, error);
        throw error;
    } finally {
        connection.release();
    }
};
