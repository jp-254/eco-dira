import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
	client_id: { type: String, index: true, unique: true, required: true },
	houseNumber: String,
	name: String,
	phone: String,
	email: String,
	address: String,
	latitude: Number,
	longitude: Number,
	billing_status: { type: String, default: "active" },
	pointsBalance: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Client", clientSchema);
