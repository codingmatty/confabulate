import { useState } from 'react';
import Router from 'next/router';
import Form from './Form';
import Input from './Input';

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const onSubmit = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { ['Content-Type']: 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.redirected) {
      Router.push(response.url);
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
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
      />
    </Form>
  );
}
