import express from "express";
import Client from "../models/Client.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// admin + clients can see
router.get("/", requireAuth(), async (req, res) => {
	if (req.user.role === "operator") {
		return res.status(403).json({ error: "Forbidden" });
	}

	const top = await Client.find()
		.select("name pointsBalance")
		.sort({ pointsBalance: -1 })
		.limit(10);

	res.json(top);
});

export default router;
