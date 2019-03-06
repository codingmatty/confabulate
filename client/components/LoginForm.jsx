import { useState } from 'react';
import Router from 'next/router';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { ['Content-Type']: 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (response.redirected) {
      Router.push(response.url);
    }
  };

  const onChange = ({ target: { value, name } }) => {
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'username') {
      setUsername(value);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
        />
      </div>
      <div>
        <button type="submit">Log In</button>
      </div>
    </form>
  );
}
