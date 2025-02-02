import pool from "../../config/db";
import { Owner } from "../../domain/Owner";

export const createOwner = async (name: string): Promise<Owner> => {
    const connection = await pool.getConnection();
    try {
        const [result]: any = await connection.query(
            "INSERT INTO owners (name) VALUES (?)",
            [name]
        );

        return { id: result.insertId, name };
    } catch (error) {
        console.error(`❌ Error creating owner:`, error);
        throw error;
    } finally {
        connection.release();
    }
};

export const getOwners = async (): Promise<Owner[]> => {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query("SELECT id, name FROM owners");
        return rows;
    } catch (error) {
        console.error("❌ Error fetching owners:", error);
        throw error;
    } finally {
        connection.release();
    }
};
