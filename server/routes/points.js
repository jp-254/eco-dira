// server/routes/points.js
import express from "express";
import PointsHistory from "../models/PointsHistory.js";
import RedemptionRecord from "../models/RedemptionRecord.js";
import Client from "../models/Client.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/points/:clientId
 * Returns { balance, history[] }
 * Protected: requireAuth()
 */
router.get("/:clientId", requireAuth(), async (req, res) => {
	const requester = req.user; // req.user from requireAuth middleware, contains sub and role
	// allow if admin OR same client
	if (requester.role !== "admin" && requester.sub !== req.params.clientId) {
		return res.status(403).json({ error: "Forbidden" });
	}
	// ... proceed to return balance & history

	try {
		const { clientId } = req.params;
		const client = await Client.findById(clientId);
		if (!client) return res.status(404).json({ error: "Client not found" });

		const history = await PointsHistory.find({ clientId: client._id })
			.sort({ date: -1 })
			.limit(500);
		res.json({ balance: client.pointsBalance || 0, history });
	} catch (err) {
		console.error("GET /api/points/:clientId error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

/**
 * GET /api/points/pending/all
 * Returns pending redemption requests (admin only)
 */
router.get("/pending/all", requireAuth("admin"), async (req, res) => {
	try {
		const pending = await RedemptionRecord.find({ status: "pending" })
			.sort({ date: -1 })
			.limit(500);
		res.json(pending);
	} catch (err) {
		console.error("GET /api/points/pending/all error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

/**
 * POST /api/points/redeem
 * Body: { clientId, pointsUsed, rewardDesc }
 * Creates a redemption request (keeps it pending for admin approval)
 */
router.post("/redeem", requireAuth(), async (req, res) => {
	try {
		const { clientId, pointsUsed, rewardDesc } = req.body;
		if (!clientId || !pointsUsed || !rewardDesc) {
			return res.status(400).json({ error: "Missing fields" });
		}
		const client = await Client.findById(clientId);
		if (!client) return res.status(404).json({ error: "Client not found" });

		// Create a pending redemption (do not deduct immediately)
		const red = await RedemptionRecord.create({
			clientId: client._id,
			pointsUsed,
			rewardDesc,
			status: "pending",
		});

		res.status(201).json(red);
	} catch (err) {
		console.error("POST /api/points/redeem error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

/**
 * POST /api/points/redeem/:id/approve
 * Admin approves a redemption -> deduct points and record PointsHistory
 */
router.post("/redeem/:id/approve", requireAuth("admin"), async (req, res) => {
	try {
		const { id } = req.params;
		const red = await RedemptionRecord.findById(id);
		if (!red) return res.status(404).json({ error: "Redemption not found" });
		if (red.status !== "pending")
			return res.status(400).json({ error: "Already processed" });

		const client = await Client.findById(red.clientId);
		if (!client) return res.status(404).json({ error: "Client not found" });

		// Check sufficient points (should be true unless admin allowed overdrafts)
		if ((client.pointsBalance || 0) < red.pointsUsed) {
			return res.status(400).json({ error: "Insufficient points" });
		}

		client.pointsBalance = (client.pointsBalance || 0) - red.pointsUsed;
		await client.save();

		await PointsHistory.create({
			clientId: client._id,
			change: -red.pointsUsed,
			reason: `redeem:${red._id}`,
			sourceRecordId: red._id,
		});

		red.status = "approved";
		red.approvedBy = req.user?.sub;
		await red.save();

		res.json(red);
	} catch (err) {
		console.error("POST /api/points/redeem/:id/approve error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
