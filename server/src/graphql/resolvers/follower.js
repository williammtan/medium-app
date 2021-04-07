import { Follower } from "../../models/follower.model";

export default {
	Query: {
		follower: async (_, { userId: String }) => {
			// find all followers to userId
			const followers = await Follower.find({ userId: userId });
			followers = followers.map((follower) => follower.followerId); // get followerId

			return followers;
		},
	},
};
