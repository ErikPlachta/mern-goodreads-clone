import { gql } from '@apollo/client';

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      bookCount
      savedBooks {
        _id
        bookId
        authors
        description
        title
        image
        link
      }
    }
    }
  }
`;

export const GET_ME = gql`
  {
    me {
      _id
      username
      bookCount
      savedBooks {
        _id
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;