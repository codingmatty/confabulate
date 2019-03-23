import { useState } from 'react';
import Router from 'next/router';
import Form from './Form';
import Input from './Input';
import useFirebase from '../utils/firebase';

export default function LoginForm() {
  const firebase = useFirebase();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });

  const onSubmit = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(formData.username, formData.password);

      const { currentUser } = firebase.auth();
      const idToken = await currentUser.getIdToken();
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { ['Content-Type']: 'application/json' },
        body: JSON.stringify({ idToken })
      });
      if (response.redirected) {
        Router.push(response.url);
      }
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

  const onChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
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
  );
}
