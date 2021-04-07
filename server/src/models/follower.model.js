import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	followerId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
});

export const Follower = mongoose.model("user_followers", schema);
