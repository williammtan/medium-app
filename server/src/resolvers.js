import { User } from "./models/user.model";
import mongoose from "mongoose";
// import { GraphQLScalarType } from 'graphql';

export const resolvers = {
	Query: {
		users: async () => {
			let users = await User.find();
			let new_users = [];

			for (const i in users) {
				let user = users[i];
				let followers = [];
				for (const j in user.following) {
					let following_id = user.following[j];
					followers.push(users.filter((user) => user._id == following_id)[0]);
				}
				new_users.push({
					_id: user._id,
					username: user.username,
					following: followers,
				});
			}

			return new_users;
		},
		user: async (_, args) => {
			let user = await User.findById({ _id: args._id });
			return user;
		},
	},
	Mutation: {
		createUser: async (_, args) => {
			const user = new User({
				_id: mongoose.Types.ObjectId(),
				username: args.username,
			});
			console.log(user);
			await user.save();
			return user;
		},
		followUser: async (_, args) => {
			let user = await User.findById(args.userId);
			if (user.following.includes(args.followingUserId)) {
				// already registered
				return user;
			}

			user.following.push(args.followingUserId);
			await user.save();
			console.log(user);
			return user;
		},
	},
};
