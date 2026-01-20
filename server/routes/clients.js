// server/routes/clients.js
import express from "express";
import mongoose from "mongoose";
import Client from "../models/Client.js";
import PointsHistory from "../models/PointsHistory.js";

const router = express.Router();

/**
 * GET /api/clients
 * Query: updated_since, page, per_page
 */
router.get("/", async (req, res) => {
	try {
		const { updated_since, page = 1, per_page = 200 } = req.query;
		const pageNum = parseInt(page, 10) || 1;
		const perPageNum = parseInt(per_page, 10) || 200;

		const query = updated_since
			? { updatedAt: { $gte: new Date(updated_since) } }
			: {};

		const clients = await Client.find(query)
			.skip((pageNum - 1) * perPageNum)
			.limit(perPageNum);

		res.json({ page: pageNum, per_page: perPageNum, data: clients });
	} catch (err) {
		console.error("GET /api/clients error:", err);
		res.status(500).json({ error: "Failed to fetch clients" });
	}
});

/**
 * POST /api/clients
 * Create or update (upsert) by client_id
 */
router.post("/", async (req, res) => {
	try {
		const data = req.body;
		if (!data.client_id) data.client_id = `c_${Date.now()}`;

		const client = await Client.findOneAndUpdate(
			{ client_id: data.client_id },
			{ ...data, updatedAt: new Date() },
			{ upsert: true, new: true }
		);

		res.status(201).json(client);
	} catch (err) {
		console.error("POST /api/clients error:", err);
		res.status(500).json({ error: "Failed to save client" });
	}
});

/**
 * GET /api/clients/:id
 * Accepts either:
 *  - a Mongo ObjectId (client._id), OR
 *  - a client_id (like "c_169...") so old client identifiers work.
 */
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Try ObjectId first
		if (mongoose.Types.ObjectId.isValid(id)) {
			const clientById = await Client.findById(id);
			if (clientById) return res.json(clientById);
			// fallthrough to try client_id next (in case someone used an id-like token)
		}

		// Fallback: find by client_id field
		const clientByClientId = await Client.findOne({ client_id: id });
		if (clientByClientId) return res.json(clientByClientId);

		// Not found
		return res.status(404).json({ error: "Client not found" });
	} catch (err) {
		console.error("GET /api/clients/:id error:", err);
		res.status(500).json({ error: "Failed to fetch client" });
	}
});

// GET /api/clients/:id/points-history
router.get("/:id/points-history", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch points history from your database
    // This depends on how you store points history
    // If you have a separate PointsHistory model:
   const history = await PointsHistory.find({
			clientId: new mongoose.Types.ObjectId(id),
		})
			.sort({ date: -1 })
			.limit(50);

    
    res.json({ data: history });
  } catch (err) {
    console.error("Error fetching points history:", err);
    res.status(500).json({ error: "Failed to fetch points history" });
  }
});

export default router;
