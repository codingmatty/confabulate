import styled from 'styled-components';
import { useState } from 'react';
import Router from 'next/router';
import useFirebase from '../utils/firebase';
import Form from './common/Form';
import Input from './common/Input';

const SignInWithGoogle = styled.button`
  background-color: white;
  border: 1px solid #ccc;
  cursor: pointer;
  display: block;
  margin-top: 2rem;
  font-size: 1rem;
  height: 2.5rem;
  width: 100%;
`;

async function registerUserWithAPI(user) {
  const idToken = await user.getIdToken();
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { ['Content-Type']: 'application/json' },
    body: JSON.stringify({ idToken })
  });
  if (response.redirected) {
    Router.push(response.url);
  }
}

export default function LoginForm() {
  const firebase = useFirebase();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });

  const onSubmit = async () => {
    try {
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(formData.username, formData.password);
      registerUserWithAPI(user);
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-disabled':
        case 'auth/user-not-found':
          setErrors({ username: 'Invalid Email' });
          break;
        case 'auth/wrong-password':
          setErrors({ password: 'Wrong Password' });
          break;
        default:
          setErrors({ general: 'Unknown Error' });
      }
    }
  };

  const onGoogleAuthClick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const { user } = await firebase.auth().signInWithPopup(provider);
    registerUserWithAPI(user);
  };

  const onChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Form onSubmit={onSubmit} submitLabel="Login">
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          error={errors.username}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
        />
        {errors.general && <div>{errors.general}</div>}
      </Form>
      <SignInWithGoogle onClick={onGoogleAuthClick}>
        Sign In with Google
      </SignInWithGoogle>
    </>
  );
}
