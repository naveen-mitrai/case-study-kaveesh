import Redis from "ioredis";
import dotenv from "dotenv";
import { REDIS_BATTERY_AUDIT_KEY } from "../config/constants";

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6380,
});

const REDIS_TTL = Number(process.env.REDIS_TTL) || 3600;

export const cacheBatteryAudit = async (droneId: number, oldBatteryLevel: number, newBatteryLevel: number) => {
    console.log(`⚡ Storing battery update in Redis | Drone ${droneId}: ${oldBatteryLevel}% → ${newBatteryLevel}%`);

    const batteryData = JSON.stringify({ oldBatteryLevel, newBatteryLevel });

    // Store in Redis as a Hash Map
    await redis.hset(REDIS_BATTERY_AUDIT_KEY, String(droneId), batteryData);

    // Set TTL (Time-To-Live) to avoid stale data
    await redis.expire(REDIS_BATTERY_AUDIT_KEY, REDIS_TTL);
};

export const getCachedBatteryAudits = async () => {
    const batteryData = await redis.hgetall(REDIS_BATTERY_AUDIT_KEY);
    console.log("Fetching Battery Audit Cache from Redis:", batteryData);

    return Object.entries(batteryData).map(([droneId, data]) => ({
        droneId: Number(droneId),
        ...JSON.parse(data as string),
    }));
};

export const clearBatteryAuditCache = async () => {
    console.log("Clearing Battery Audit Cache in Redis...");
    await redis.del(REDIS_BATTERY_AUDIT_KEY);
};
