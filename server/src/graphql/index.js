import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

export default {
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res }),
};
