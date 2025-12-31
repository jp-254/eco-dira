import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
	name: String,
	minPoints: Number,
	maxPoints: Number,
});

export default mongoose.model("Reward", rewardSchema);
