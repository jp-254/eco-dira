import mongoose from "mongoose";
import dotenv from "dotenv";
import Client from "./models/Client.js";
import Program from "./models/Program.js";
import Admin from "./models/Admin.js";
import Operator from "./models/Operator.js";
import bcrypt from "bcrypt";

dotenv.config();

const run = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ Connected to MongoDB");

		// Prevent destructive deletes in production
		if (process.env.NODE_ENV === "production") {
			console.warn("⚠️ Refusing to delete data in production");
			process.exit(1);
		}

		// Clear collections in dev only
		await Client.deleteMany({});
		await Program.deleteMany({});
		await Admin.deleteMany({});
		await Operator.deleteMany({});

		// Use env vars for admin credentials
		const adminUsername = process.env.ADMIN_USERNAME ;
		const adminPassword = process.env.ADMIN_PASSWORD ;
		const pwHash = await bcrypt.hash(adminPassword, 10);

		await Admin.create({ username: adminUsername, passwordHash: pwHash });

		// Seed sample clients
		await Client.create([
			{
				client_id: "c1",
				houseNumber: "A1",
				name: "Wanjiru",
				phone: "+254700000000",
				pointsBalance: 0,
			},
			
		]);

		// Seed operator
		const operatorPassword = process.env.OPERATOR_PASSWORD;
		const operatorHash = await bcrypt.hash(operatorPassword, 10);

		await Operator.create({
			name: "Operator",
			email: "ecodiraservices@gmail.com",
			phone: "+254700000001",
			passwordHash: operatorHash,
			role: "operator",
			assignedAreas: ["Zone A"],
		});

		// Seed program
		await Program.create({
			title: "Mangu High School Training",
			location: "Mangu",
			startTime: new Date(),
			live: false,
		});

		console.log("🌱 Seed complete - admin user created");
		process.exit(0);
	} catch (err) {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	}
};

run();
