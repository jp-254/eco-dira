import express from "express";
import PointConfig from "../models/PointConfig.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all configs (admin only)
router.get("/", requireAuth("admin"), async (req, res) => {
	try {
		const configs = await PointConfig.find().sort({ type: 1 });
		res.json(configs);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch configs" });
	}
});

// UPDATE points per kg (admin only)
router.put("/:id", requireAuth("admin"), async (req, res) => {
	try {
		const { pointsPerKg } = req.body;
		if (typeof pointsPerKg !== "number") {
			return res.status(400).json({ error: "Invalid points value" });
		}

		const updated = await PointConfig.findByIdAndUpdate(
			req.params.id,
			{ pointsPerKg },
			{ new: true }
		);

		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: "Update failed" });
	}
});

export default router;
