const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Book {
    _id: ID
    bookId: String
    authors: [String]
    description: String
    title:  String
    image:  String
    link:   String
  }

  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
    bookCount: Int
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
    saveBook(_id: String!, bookBody: String!): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
