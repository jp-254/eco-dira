import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		phone: String,
		assignedAreas: [String],
		active: { type: Boolean, default: true },
		passwordHash: String, // optional if you want operator auth
	},
	{ timestamps: true }
);

export default mongoose.model("Operator", operatorSchema);
