export default function Login() {
  return (
    <form action="/api/login" method="post">
      <div>
        <label>Username:</label>
        <input type="text" name="username" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" />
      </div>
      <div>
        <input type="submit" value="Log In" />
      </div>
    </form>
  );
}
