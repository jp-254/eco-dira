import mongoose from "mongoose";

const PointConfigSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			unique: true, // plastic, glass, metal
		},
		pointsPerKg: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("PointConfig", PointConfigSchema);
