// server/models/Client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
	{
		client_id: { type: String, index: true },
		name: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		email: { type: String },
		houseNumber: { type: String },
		pointsBalance: { type: Number, default: 0 },
		 location: {
			lat: { type: Number },
			lon: { type: Number },
		},
		active: { type: Boolean, default: true },
		passwordHash: { type: String }, // for client logins
	},
	{ timestamps: true }
);

export default mongoose.model("Client", clientSchema);
