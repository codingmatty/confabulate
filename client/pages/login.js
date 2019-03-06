import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

const LoginPage = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: fixed; // temp
`;

export default function Login() {
  return (
    <LoginPage>
      <LoginForm />
    </LoginPage>
  );
}
