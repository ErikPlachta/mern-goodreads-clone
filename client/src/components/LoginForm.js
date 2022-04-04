import React, { useState } from 'react';
//-- onboarding basic styling framework to focus mvp
import { Form, Button, Alert } from 'react-bootstrap';
//-- APOLLO!
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
//-- JWT Auth
import Auth from '../utils/auth';

const LoginForm = () => {
  //-- Apollo GraphQL database mutation
  const [login, { error }] = useMutation(LOGIN_USER);
  //-- form management
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false); //?
  const [showAlert, setShowAlert] = useState(false); //?

  //-- When user inputs data into form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  //-- when user attempts login
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    //-- STOP if doesn't form doesn't meet requirements
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    //-- Apollo GraphQL Call
    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      Auth.login(data.login.token);
      
      //--or fail!
    }catch (err) {
      setShowAlert(true);
    }

    //-- blank form
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
