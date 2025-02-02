import pool from "../../config/db";

export const getMedicationWithPharmacy = async (medicationId: string): Promise<any> => {
    const connection = await pool.getConnection(); // ✅ Acquire connection
    try {
        const [rows]: any = await connection.query(
            `SELECT m.id, m.name, m.weight, m.code, m.store_latitude, m.store_longitude
             FROM medications m
             WHERE m.id = ?`,
            [medicationId]
        );

        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error(`❌ Error fetching medication ${medicationId}:`, error);
        return null;
    } finally {
        connection.release();
    }
};

export const getMedications = async (): Promise<any[]> => {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query(`
            SELECT id, name, weight, code, store_latitude, store_longitude 
            FROM medications
        `);
        return rows;
    } catch (error) {
        console.error("❌ Error fetching medications:", error);
        throw error;
    } finally {
        connection.release();
    }
};
