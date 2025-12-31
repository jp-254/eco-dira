import mongoose from "mongoose"; 
import dotenv from "dotenv"; 
import PointConfig from "./models/PointConfig.js";

dotenv.config();

const seed = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ MongoDB connected");

		await PointConfig.deleteMany();

		await PointConfig.insertMany([ 
			{ type: "plastic", pointsPerKg: 15 },
			{ type: "glass", pointsPerKg: 5 },
			{ type: "metal", pointsPerKg: 20 },
			{ type: "whitepaper", pointsPerKg: 10 },
			{ type: "brownpaper", pointsPerKg: 5 },
			{ type: "organic", pointsPerKg: 2 },
			{ type: "e-waste", pointsPerKg: 5 },
		]);

		console.log("🌱 PointConfig seeded successfully");
		process.exit();
	} catch (err) {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	}
};

seed();
