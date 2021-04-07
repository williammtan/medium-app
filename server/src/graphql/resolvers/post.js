import { Post } from "../../models/post.model";
import { AuthenticationError } from "apollo-server-express";
import mongoose from "mongoose";
import { postAuth, requiresAuth } from "../../auth/permissions";

const accessPost = (postId, userId) => {
	// if the user can access the post
	const post = Post.findById(postId);
	if (post._id != userId) {
		throw new AuthenticationError("Cannot access post!");
	}
	return post;
};

export default {
	Query: {
		posts: async () => {
			// return all posts
			const posts = await Post.find();
			return posts;
		},
		post: async (_, { _id: String }) => {
			// return specific post
			try {
				const post = await Post.findById(_id);
				return post;
			} catch (err) {
				return null;
			}
		},
	},
	Mutation: {
		createPost: requiresAuth.createResolver(
			async (_, { postInput: { postName, markdown } }, context) => {
				const newPost = new Post({
					name: postName,
					markdown: markdown,
					// createdBy: context.req.user
					createdBy: context.req.user,
				});
				await newPost.save();
				return newPost;
			}
		),
		updatePost: postAuth.createResolver(
			async (_, { postId, postInput: { postName, markdown } }, context) => {
				const post = await Post.findById(postId);
				post.name = postName;
				post.markdown = markdown;
				await post.save();

				return post;
			}
		),
		deletePost: postAuth.createResolver(async (_, { postId }) => {
			await Post.findByIdAndDelete(postId);
		}),
	},
};
