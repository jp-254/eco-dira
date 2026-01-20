// server/models/RedemptionRecord.js
import mongoose from "mongoose";

const redemptionSchema = new mongoose.Schema({
	clientId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Client",
		required: true,
	},
	pointsUsed: { type: Number, required: true },
	rewardDesc: { type: String, required: true },
	date: { type: Date, default: Date.now },
	status: { type: String, default: "pending" }, // pending, approved, declined
	approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

export default mongoose.model("RedemptionRecord", redemptionSchema);
