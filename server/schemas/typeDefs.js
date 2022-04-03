const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [bookSchema]
    bookCount: Int
  }

  type Book {
    _id: ID
    bookId: String
    authors: Array
    description: String
    title:  String
    image:  String
    link:   String
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
    login(body: String!): Auth
    saveBook(_id: String!, body: String!): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
