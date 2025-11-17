import mongoose from "mongoose";

const wasteRecordSchema = new mongoose.Schema({
	clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
	type: { type: String, required: true },
	weightKg: { type: Number, required: true },
	dateCollected: { type: Date, default: Date.now },
	location: { lat: Number, lon: Number },
	operatorId: String,
	notes: String,
	mediaUrl: String,
});

export default mongoose.model("WasteRecord", wasteRecordSchema);
