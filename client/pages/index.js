import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';

const HomePage = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed; // temp
`;

export default function Home() {
  const onClick = async () => {
    const response = await fetch('/api/logout');
    if (response.redirected) {
      Router.push(response.url);
    }
  };
  return (
    <HomePage>
      <div>Home</div>
      <div>
        <button onClick={onClick}>Logout</button>
      </div>
      <div>
        <Link href="/graphql">GraphQL Playground</Link>
      </div>
      <div>
        <Link href="/contacts/create">Create Contact</Link>
      </div>
    </HomePage>
  );
}
