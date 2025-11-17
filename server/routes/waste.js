import express from "express";
import WasteRecord from "../models/WasteRecord.js";
import Client from "../models/Client.js";
import PointsHistory from "../models/PointsHistory.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const pointsPerKg = {
	"white paper": 10,
	"brown paper": 5,
	metal: 20,
	plastic: 15,
	glass: 5,
	organic: 2,
};

// create waste record (operator or admin)
router.post("/", requireAuth(), async (req, res) => {
	try {
		const { clientId, type, weightKg, location, operatorId, notes } = req.body;
		const record = await WasteRecord.create({
			clientId,
			type,
			weightKg,
			location,
			operatorId,
			notes,
		});
		const points = (pointsPerKg[type] || 5) * (weightKg || 0);
		if (clientId) {
			// update client points balance
			await Client.findByIdAndUpdate(clientId, {
				$inc: { pointsBalance: points },
				$set: { updatedAt: new Date() },
			});
			// record history
			await PointsHistory.create({
				clientId,
				change: points,
				reason: `collection:${record._id}`,
				sourceRecordId: record._id,
			});
		}
		res.status(201).json({ record, pointsAwarded: points });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create record" });
	}
});

// list records
router.get("/", requireAuth(), async (req, res) => {
	const { client } = req.query;
	const query = client ? { clientId: client } : {};
	const records = await WasteRecord.find(query)
		.sort({ dateCollected: -1 })
		.limit(500);
	res.json(records);
});

export default router;
