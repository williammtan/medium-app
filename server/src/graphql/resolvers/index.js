import userResolver from "./user";
import postResolver from "./post";
import post from "./post";

export default {
	Query: {
		...userResolver.Query,
		...postResolver.Query,
	},
	Mutation: {
		...userResolver.Mutation,
		...postResolver.Mutation,
	},
};
