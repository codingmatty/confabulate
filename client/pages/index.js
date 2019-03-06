import Router from 'next/router';

export default function Home() {
  const onClick = async () => {
    const response = await fetch('/api/logout');
    if (response.redirected) {
      Router.push(response.url);
    }
  };
  return (
    <div>
      Home
      <button onClick={onClick}>Logout</button>
    </div>
  );
}
