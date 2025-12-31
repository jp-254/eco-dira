import mongoose from "mongoose";
import Reward from "./models/Reward.js";
import dotenv from "dotenv";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await Reward.deleteMany({});
await Reward.insertMany([
	{ name: "Tree Seedling 🌱", minPoints: 200, maxPoints: 1999 },
	{ name: "Sports Equipment ⚽", minPoints: 2000, maxPoints: 5000 },
	{ name: "Cash 💰", minPoints: 5001, maxPoints: 999999 },
]);

console.log("Rewards seeded");
process.exit();
