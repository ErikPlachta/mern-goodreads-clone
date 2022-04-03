const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const path = require('path');

//TODO:: 04/03/2022 #EP || Onboard Apollo server
// const {typeDefs, resolvers} = require('./schemas');
// const {authMiddleware} = require('./utils/auth');

const db = require('./config/connection');
//TODO:: 04/03/2022 #EP || Comment out routes once GraphQL boarded
const routes = require('./routes');

//TODO:: 04/03/2022 #EP || Onboard Apollo server
/*
//-- starting up Apollo Server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

startServer()

*/

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//TODO: 04/03/2022 #EP || Remove this once onboarding Apollo
app.use(routes);

//TODO:: 04/03/2022 #EP || Onboard Apollo server
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});
