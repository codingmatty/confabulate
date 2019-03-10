import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

const StyledLoginPage = styled.div`
  padding: 1rem;
`;

export default function Login() {
  return (
    <StyledLoginPage>
      <h1>Login</h1>
      <LoginForm />
    </StyledLoginPage>
  );
}
