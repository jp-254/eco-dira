import mongoose from "mongoose";

const pointsHistorySchema = new mongoose.Schema({
	clientId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Client",
		required: true,
	},
	change: { type: Number, required: true },
	reason: { type: String }, // e.g., "collection:recordId" or "redeem"
	sourceRecordId: { type: mongoose.Schema.Types.ObjectId }, // reference to waste record or redemption
	date: { type: Date, default: Date.now },
});

export default mongoose.model("PointsHistory", pointsHistorySchema);
