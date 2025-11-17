import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routers
import authRouter from "./routes/auth.js";
import pointsRouter from "./routes/points.js";
import clientsRouter from "./routes/clients.js";
import wasteRouter from "./routes/Waste.js";
import programsRouter from "./routes/programs.js";

// Initialize Express app
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

// Root route
app.get("/", (req, res) => res.send("ECO DIRA backend is running 🚀"));

// Start server and connect to MongoDB
const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ MongoDB connected");

		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
	}
};

start();
