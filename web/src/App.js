import "./App.css";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "https://48p1r2roz4.sse.codesandbox.io",
	cache: new InMemoryCache(),
});

function App() {
	return <ApolloProvider client={client}></ApolloProvider>;
}

export default App;
