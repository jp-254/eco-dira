import express from "express";
import PointsHistory from "../models/PointsHistory.js";
import RedemptionRecord from "../models/RedemptionRecord.js";
import Client from "../models/Client.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// get points balance + history
router.get("/:clientId", requireAuth(), async (req, res) => {
	const { clientId } = req.params;
	const client = await Client.findById(clientId);
	if (!client) return res.status(404).json({ error: "Client not found" });
	const history = await PointsHistory.find({ clientId })
		.sort({ date: -1 })
		.limit(200);
	res.json({ balance: client.pointsBalance || 0, history });
});

// redemption request (client or admin)
router.post("/redeem", requireAuth(), async (req, res) => {
	try {
		const { clientId, pointsUsed, rewardDesc } = req.body;
		const client = await Client.findById(clientId);
		if (!client) return res.status(404).json({ error: "Client not found" });
		if ((client.pointsBalance || 0) < pointsUsed)
			return res.status(400).json({ error: "Insufficient points" });

		const redemption = await RedemptionRecord.create({
			clientId,
			pointsUsed,
			rewardDesc,
			status: "pending",
		});
		// immediately deduct points (or wait until admin approves — here we deduct on approval)
		// For safer flow, don't deduct until approved. We'll keep points until admin approves.
		res.json({ redemption });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Redemption failed" });
	}
});

// admin approve redemption
router.post("/redeem/:id/approve", requireAuth("admin"), async (req, res) => {
	try {
		const { id } = req.params;
		const red = await RedemptionRecord.findById(id);
		if (!red) return res.status(404).json({ error: "Not found" });
		if (red.status !== "pending")
			return res.status(400).json({ error: "Already processed" });
		// deduct points
		const client = await Client.findById(red.clientId);
		client.pointsBalance = (client.pointsBalance || 0) - red.pointsUsed;
		await client.save();
		// record history
		await PointsHistory.create({
			clientId: client._id,
			change: -red.pointsUsed,
			reason: `redeem:${red._id}`,
			sourceRecordId: red._id,
		});
		red.status = "approved";
		red.approvedBy = req.user.sub;
		await red.save();
		res.json({ red });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Approve failed" });
	}
});

export default router;
