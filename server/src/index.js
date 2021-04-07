import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
	verifyRefreshToken,
	verifyAccessToken,
	createAccessToken,
} from "./auth/auth";
import { User } from "./models/user.model";
import cookieParser from "cookie-parser";

// import { resolvers } from "./resolvers.js";
// import typeDefs from "./schema.graphql";
import graphql from "./graphql";

const startServer = async () => {
	dotenv.config();
	const app = express();

	const addUser = async (req, res) => {
		// check if they have access token
		const accessToken = req.cookies["accessToken"];
		const refreshToken = req.cookies["refreshToken"];
		const accessTokenData = verifyAccessToken(accessToken);
		const refreshTokenData = verifyRefreshToken(refreshToken);

		if (accessTokenData) {
			const userId = accessTokenData._id;
			req.user = userId;
		} else if (refreshTokenData) {
			// update accessToken
			const userId = refreshTokenData._id;
			const user = await User.findById(userId);
			if (user._id) {
				const newAccessToken = createAccessToken(user._id);
				res.cookie("accessToken", newAccessToken);
				req.user = user._id;
			}
		}
		req.next();
	};

	app.use(express.json());
	app.use(cookieParser());
	app.use(addUser);

	const server = new ApolloServer(graphql);

	server.applyMiddleware({ app });

	await mongoose.connect(process.env.MONGO_DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	app.listen({ port: process.env.PORT }, () => {
		console.log(`Listening at port ${process.env.PORT}!`);
	});
};

startServer();
