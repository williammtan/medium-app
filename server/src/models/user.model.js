import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	following: [
		{
			type: mongoose.Types.ObjectId,
		},
	],
});

export const User = mongoose.model("users", schema);
