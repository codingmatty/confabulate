import styled, { keyframes } from 'styled-components';

const spin = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const Loader = styled.div`
  position: relative;
  margin: 2rem auto;
  font-size: ${({ size }) => size || 3}rem;
  width: 1em;
  height: 1em;

  &::after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 0.2em solid ${({ theme }) => theme.color.blues[1]};
    border-top-color: ${({ theme }) => theme.color.blues[5]};
    animation: ${spin} 1s linear 0s infinite;
  }
`;

export default Loader;
