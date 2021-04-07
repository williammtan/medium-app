import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	// createdAt: { // TODO: Implement date scalar
	// 	type: Date,
	// 	required: true,
	// },
	markdown: {
		type: String,
		default: "",
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	likes: [
		{
			type: mongoose.Types.ObjectId,
		},
	],
});

export const Post = mongoose.model("posts", schema);
