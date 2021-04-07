import { gql } from "apollo-server-express";

export default gql`
	type Query {
		me: User!
		users: [User!]
		user(_id: ID!): User

		follower(_id: ID!): [Follower]!

		posts: [Post]
		post(_id: ID!): Post
	}

	input RegisterInput {
		username: String!
		email: String!
		password: String!
		confirmPassword: String!
	}

	input LoginInput {
		username: String!
		password: String!
	}

	type User {
		_id: ID!
		username: String
		following: [User]
		email: String
		# bio: String
		# posts: [Post]
	}

	type: Follower {
		_id: ID!

	}

	# type File {
	# 	id: ID!
	# 	filename: String!
	# 	mimetype: String!
	# 	encoding: String!
	# }

	type Post {
		_id: ID!
		name: String!
		# thumbnail: File
		markdown: String!
		createdBy: User!
		likes: [User!]
	}

	input PostInput {
		postName: String!
		markdown: String!
	}

	type Mutation {
		createUser(username: String!): User!
		register(registerInput: RegisterInput): Boolean
		login(loginInput: LoginInput): User
		logout: Boolean
		followUser(userId: ID!, followingUserId: ID!): User!

		createPost(postInput: PostInput): Post!
		updatePost(postId: ID!, postInput: PostInput): Post!
		deletePost(postId: ID!): Post!
	}
`;
