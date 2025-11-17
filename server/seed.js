import mongoose from "mongoose";
import dotenv from "dotenv";
import Client from "./models/Client.js";
import Program from "./models/Program.js";
import Admin from "./models/Admin.js";
import Operator from "./models/Operator.js";
import bcrypt from "bcrypt";

dotenv.config();

const run = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	await Client.deleteMany({});
	await Program.deleteMany({});
	await Admin.deleteMany({});
	await Operator.deleteMany({});

	const pw = await bcrypt.hash("admin1234", 10);
	await Admin.create({ username: "admin", passwordHash: pw });

	const c1 = await Client.create({
		client_id: "c1",
		houseNumber: "A1",
		name: "Wanjiru",
		phone: "+254712345678",
		pointsBalance: 0,
	});
	const c2 = await Client.create({
		client_id: "c2",
		houseNumber: "B2",
		name: "Mwangi",
		phone: "+254712345679",
		pointsBalance: 0,
	});
	const op = await Operator.create({
		name: "Operator One",
		email: "op1@example.com",
		phone: "+254700000001",
		assignedAreas: ["Zone A"],
	});

	await Program.create({
		title: "Mangu High School Training",
		location: "Mangu",
		startTime: new Date(),
		live: false,
	});
	console.log("Seed complete - admin credentials: admin / admin1234");
	process.exit(0);
};

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
