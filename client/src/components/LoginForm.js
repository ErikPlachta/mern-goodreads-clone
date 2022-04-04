// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { loginUser } from '../utils/API';
import Auth from '../utils/auth';

//-- APOLLO!
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

const LoginForm = () => {
  //-- Apollo database call
  const [login, { error }] = useMutation(LOGIN_USER);
  //-- username and pass in login form
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false); //?
  const [showAlert, setShowAlert] = useState(false); //?

  //-- When user inputs data event, listen for change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  //-- when user tries to login
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;

    //-- STOP if doesn't form doesn't meet requirements
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    //-- otherwise try to login
    // try {
      
    //   //-- RESTful API Call
    //   const response = await loginUser(userFormData);
      
    //   //-- if fails to login, throw error
    //   if (!response.ok) {
    //     throw new Error('ERROR: Check with Admin or try again later.');
    //   }
    //   //-- otherwise return user and token 
    //   const { token, user } = await response.json();
    //   //-- then authorize user
    //   Auth.login(token);
    //   // console.log(user);
    // } catch (err) {
    //   console.error(err);
    //   setShowAlert(true);
    // }

    //-- GraphQL Call
    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      Auth.login(data.login.token);
      
      //--or fail!
    }catch (e) {
      console.error(e);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Invalid credentials or account does not.<br/>
          Please verify your account details and try again.
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
