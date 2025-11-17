import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
	title: String,
	location: String,
	startTime: Date,
	endTime: Date,
	durationSeconds: Number,
	recordedByOperatorId: String,
	live: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Program", programSchema);
