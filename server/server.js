// server.js - Main entry point for ECO DIRA backend
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
import wasteRouter from "./routes/waste.js";
import programsRouter from "./routes/programs.js";
import leaderboardRouter from "./routes/leaderboard.js";
import rewardsRouter from "./routes/rewards.js";
import pointConfigRoutes from "./routes/pointconfig.js";

// Init app
const app = express();

// ============================
// ✅ SAFE PRODUCTION CORS
// ============================

const allowedOrigins = [
	"https://ecodira.co.ke",
	"https://www.ecodira.co.ke",
	"https://api.ecodira.co.ke",
	"http://localhost:5173",
];

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow Postman / server-to-server / no-origin requests
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// DO NOT manually use app.options("*", cors());
// It breaks on newer router versions

app.use(express.json());

// ============================
// ROUTES
// ============================

app.use("/api/auth", authRouter);
app.use("/api/points", pointsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/waste", wasteRouter);
app.use("/api/programs", programsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/rewards", rewardsRouter);
app.use("/api/point-config", pointConfigRoutes);

// Root route
app.get("/", (req, res) => {
	res.send("ECO DIRA backend is running 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
	console.error("🔥 Server error:", err.message);
	res.status(500).json({ error: "Internal server error" });
});

// ============================
// START SERVER
// ============================

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
