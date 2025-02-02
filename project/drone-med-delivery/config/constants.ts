export const BASE_LOCATION = { latitude: 6.9271, longitude: 79.8612 }; // Colombo 01
export const BATTERY_CONSUMPTION_PER_KM = 5; // Battery drain per 1 km
export const DRONE_SPEED_KM_PER_HOUR = 60; // Assume 30 km/h
export const LOCATION_UPDATE_INTERVAL = 5; // Update location every 10s
export const ORDER_CACHE_TTL = 60 * 5; // Cache orders for 5 minutes
export const REDIS_BATTERY_AUDIT_KEY = "drone_battery_audit";
export const REDIS_TTL = 60 * 5; // Cache expires in 5 minutes
export const BATTERY_AUDIT_FLUSH_INTERVAL = 20000; // 20 seconds
