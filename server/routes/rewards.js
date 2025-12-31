import express from "express";
import Reward from "../models/Reward.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth(), async (req, res) => {
	if (req.user.role === "operator") return res.sendStatus(403);
	const rewards = await Reward.find();
	res.json(rewards);
});

router.put("/:id", requireAuth("admin"), async (req, res) => {
	await Reward.findByIdAndUpdate(req.params.id, req.body);
	res.sendStatus(200);
});

export default router;
