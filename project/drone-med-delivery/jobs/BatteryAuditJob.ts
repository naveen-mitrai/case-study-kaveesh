import { getCachedBatteryAudits, clearBatteryAuditCache } from "../cache/BatteryCache";
import pool from "../config/db";
import { BATTERY_AUDIT_FLUSH_INTERVAL } from "../config/constants";

export const flushBatteryAudit = async () => {
    const batteryData = await getCachedBatteryAudits();

    console.log("🔍 Battery Audit Cache Before Flush:", batteryData);

    if (batteryData.length === 0) {
        console.log("⚡ No battery updates to flush.");
        return;
    }

    const query = `INSERT INTO drone_battery_audit (drone_id, old_battery_level, new_battery_level) VALUES ?`;
    const values = batteryData.map(row => [row.droneId, row.oldBatteryLevel, row.newBatteryLevel]);

    try {
        await pool.query(query, [values]);
        console.log(`✅ Flushed ${values.length} battery audit logs to DB.`);
        await clearBatteryAuditCache();
    } catch (error) {
        console.error("❌ Error flushing battery audit logs:", error);
    }
};

// ✅ Run job every 20 seconds
setInterval(flushBatteryAudit, BATTERY_AUDIT_FLUSH_INTERVAL);
