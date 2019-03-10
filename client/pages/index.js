import Link from 'next/link';
import Router from 'next/router';

export default function Home() {
  const onClick = async () => {
    const response = await fetch('/api/logout');
    if (response.redirected) {
      Router.push(response.url);
    }
  };
  return (
    <>
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
    </>
  );
}
