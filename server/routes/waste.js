import express from "express";
import WasteRecord from "../models/WasteRecord.js";
import Client from "../models/Client.js";
import PointsHistory from "../models/PointsHistory.js";
import { requireAuth } from "../middleware/auth.js";
import PointConfig from "../models/PointConfig.js";


const router = express.Router();



// create waste record (operator)
router.post("/", requireAuth("operator"), async (req, res) => {
    try {
        const { clientId, type, weightKg, location, operatorId, notes } = req.body;

        // Validate waste type and get points configuration
        const config = await PointConfig.findOne({ type });
        if (!config) {
            return res.status(400).json({ error: "Invalid waste type" });
        }

        // Create waste record
        const record = await WasteRecord.create({
            clientId,
            type,
            weightKg,
            location,
            operatorId,
            notes,
        });

        // Calculate points based on config
        const points = weightKg * config.pointsPerKg;

        if (clientId) {
            // Update client points balance
            await Client.findByIdAndUpdate(clientId, {
                $inc: { pointsBalance: points },
                $set: { updatedAt: new Date() },
            });

            // Record points history
            await PointsHistory.create({
                clientId,
                change: points,
                reason: `collection:${record._id}`,
                sourceRecordId: record._id,
            });

            // Update client's last known location if provided
            if (location && location.lat && location.lon) {
                await Client.findByIdAndUpdate(clientId, {
                    $set: { location: { lat: location.lat, lon: location.lon } },
                });              
            }
        }

        res.status(201).json({ record, pointsAwarded: points });
    } catch (err) {
        console.error("POST /api/waste error:", err);
        res.status(500).json({ error: "Failed to create waste record" });
    }
});

// list records
router.get("/", requireAuth(), async (req, res) => {
    try {
        const { clientId, limit = 500 } = req.query;
        const query = clientId ? { clientId } : {};
        const records = await WasteRecord.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit, 10));
        res.json(records);
    } catch (err) {
        console.error("GET /api/waste error:", err);
        res.status(500).json({ error: "Failed to fetch waste records" });
    }
});

export default router;
