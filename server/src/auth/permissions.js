import { AuthenticationError } from "apollo-server-express";
import { Post } from "../models/post.model";

const createResolver = (resolver) => {
	const baseResolver = resolver;
	baseResolver.createResolver = (childResolver) => {
		const newResolver = async (parent, args, context, info) => {
			await resolver(parent, args, context, info);
			return childResolver(parent, args, context, info);
		};
		return createResolver(newResolver);
	};
	return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
	console.log(context.req.user);
	if (!context.req.user) {
		throw new AuthenticationError("Not authenticated");
	}
});

export const postAuth = requiresAuth.createResolver(
	async (parent, args, context) => {
		// if the user can access the post
		console.log(args.postId);
		const post = await Post.findById(args.postId);
		console.log(post.createdBy);
		console.log(context.user);
		if (post.createdBy != context.user) {
			throw new AuthenticationError("Cannot access post!");
		}
	}
);
