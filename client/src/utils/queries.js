import { gql } from '@apollo/client';


export const GET_USER = gql`
  query getUser($email: String, $username: String, $_id: ID) {
    getUser(email: $email, username: $username, _id: $id) {
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

export const GET_ME = gql`
  query me{
    me {
      _id
      username
      email
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
