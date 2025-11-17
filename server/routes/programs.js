import express from "express";
import Program from "../models/Program.js";
const router = express.Router();

router.post("/start", async (req, res) => {
	const { title, location, recordedByOperatorId } = req.body;
	const p = await Program.create({
		title,
		location,
		startTime: new Date(),
		recordedByOperatorId,
		live: true,
	});
	res.json(p);
});

router.post("/stop", async (req, res) => {
	const { id } = req.body;
	const p = await Program.findById(id);
	if (!p) return res.status(404).json({ error: "Program not found" });
	p.endTime = new Date();
	p.durationSeconds = Math.round((p.endTime - p.startTime) / 1000);
	p.live = false;
	await p.save();
	res.json(p);
});

router.get("/", async (req, res) => {
	const list = await Program.find().sort({ createdAt: -1 }).limit(200);
	res.json(list);
});

export default router;
