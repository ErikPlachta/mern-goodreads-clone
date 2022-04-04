import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
// import { Redirect, useParams } from 'react-router-dom';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

//-- APOLLO / Graphql
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, GET_USER } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  // const { username: userParam } = useParams();
  const [deleteBook, { deleteError }] = useMutation(DELETE_BOOK);
  
  //--  mocking with dummy data to get it to work
  const [userData, setUserData] = useState({
    _id: "_id",
    username: "username",
    email: "email",
    savedBooks: [
      {
        _id:  "_id",
        bookId:   "bookId",
        authors :   "authors ",
        description:  "description",
        title:  "title",
        image:  "image",
        link:   "link",
      } 
    ] 
  });

  //-- loading to maintain loading content on page until database accessed
  // Auth.getProfile().data ? GET_USER : GET_ME,
  const { loading, userError, data } = useQuery(GET_ME, {
    variables: { ...Auth.getProfile().data } 
  });

  //? need to get this working
  const user = data || {};
  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(user).length;

  

  useEffect(() => {

    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }
        

        // const userJSON = await JSON.stringify(user);
        // setUserData(userJSON);
      } catch (err) {
        console.error(err);
      }
    };

    console.log("useEffect");
    getUserData();
    console.table(userData);
    console.table(Auth.getProfile().data);
    
    console.table(data)
    
  }, [userDataLength]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  else {
  }
  
  
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await deleteBook(bookId, token);

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);

      
      const { updatedUser } = await deleteBook(bookId, token);

      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
