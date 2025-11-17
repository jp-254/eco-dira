import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Client from "../models/Client.js";
dotenv.config();

const client = axios.create({
	baseURL: process.env.PROPTECH_BASE_URL,
	headers: { Authorization: `Bearer ${process.env.PROPTECH_API_KEY}` },
	timeout: 10000,
});

const run = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	console.log("Connected DB, starting proptech sync...");
	try {
		const res = await client.get("/clients?per_page=500");
		const arr = res.data.data || res.data;
		for (const item of arr) {
			const payload = {
				client_id: item.client_id || item.id || `c_${Date.now()}`,
				houseNumber: item.house_number || item.houseNumber,
				name: item.name,
				phone: item.phone,
				email: item.email,
				address: item.address,
				latitude: item.latitude,
				longitude: item.longitude,
				billing_status: item.billing_status,
				updatedAt: item.updated_at || item.updatedAt,
			};
			await Client.findOneAndUpdate({ client_id: payload.client_id }, payload, {
				upsert: true,
				new: true,
			});
		}
		console.log("Sync finished");
	} catch (err) {
		console.error("Sync error:", err.response?.data || err.message);
	}
	process.exit(0);
};

run();
