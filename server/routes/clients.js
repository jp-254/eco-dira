import express from "express";
import Client from "../models/Client.js";
const router = express.Router();

router.get("/", async (req, res) => {
	const { updated_since, page = 1, per_page = 200 } = req.query;
	const query = updated_since
		? { updatedAt: { $gte: new Date(updated_since) } }
		: {};
	const clients = await Client.find(query)
		.skip((page - 1) * per_page)
		.limit(parseInt(per_page));
	res.json({ page, per_page, data: clients });
});

router.post("/", async (req, res) => {
	const data = req.body;
	if (!data.client_id) data.client_id = `c_${Date.now()}`;
	const client = await Client.findOneAndUpdate(
		{ client_id: data.client_id },
		{ ...data, updatedAt: new Date() },
		{ upsert: true, new: true }
	);
	res.status(201).json(client);
});

export default router;
