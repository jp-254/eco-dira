import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

// Import routes
import authRouter from "./routes/auth.js";
import pointsRouter from "./routes/points.js";
import clientsRouter from "./routes/clients.js";
import wasteRouter from "./routes/Waste.js";
import programsRouter from "./routes/programs.js";
import leaderboardRouter from "./routes/leaderboard.js"; // ✅ NEW
import rewardsRouter from "./routes/rewards.js"; // ✅ NEW
// Init app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/points", pointsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/waste", wasteRouter);
app.use("/api/programs", programsRouter);
app.use("/api/leaderboard", leaderboardRouter); // ✅ NEW
app.use("/api/rewards", rewardsRoutes); // ✅ NEW

// Root route
app.get("/", (req, res) => {
	res.send("ECO DIRA backend is running 🚀");
});

// Global error handler (optional but pro)
app.use((err, req, res, next) => {
	console.error("🔥 Server error:", err);
	res.status(500).json({ error: "Internal server error" });
});

// Start server
const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ MongoDB connected");

		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		process.exit(1);
	}
};

start();
