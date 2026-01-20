// server/models/PointConfig.js
import mongoose from "mongoose";

const PointConfigSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			unique: true, // plastic, glass, metal, organic, e-waste, textile
		},
		pointsPerKg: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("PointConfig", PointConfigSchema);
