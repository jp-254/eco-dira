// server/test-conn.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
console.log("Using MONGO_URI:", uri?.slice?.(0, 80) + "...");

mongoose
	.connect(uri, { dbName: "eco-dira" })
	.then(() => {
		console.log("✅ Connected to MongoDB Atlas!");
		return mongoose.disconnect();
	})
	.catch((err) => {
		console.error("❌ Connection failed:", err.message);
		process.exit(1);
	});
