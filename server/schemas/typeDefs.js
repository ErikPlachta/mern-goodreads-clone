const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [bookSchema]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getSingleUser( _id: ID, username: String ): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(_id: String!, authors: Array!, bookId: String!, title: String!, description: String!,image: String!): savedBooks
    deleteBook(bookId: String!): Book
  }
`;

module.exports = typeDefs;
