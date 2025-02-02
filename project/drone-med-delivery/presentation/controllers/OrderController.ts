import { Request, Response } from "express";
import { placeOrder } from "../../application/services/OrderService";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { medicationId, dropLat, dropLon, customerId } = req.body;
        const order = await placeOrder(medicationId, dropLat, dropLon, customerId);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
