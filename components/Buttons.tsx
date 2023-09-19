import { Props } from "next/script";
import styled, { css } from "styled-components";

const buttonStyles = css`
  display: inline-flex;
  background-color: ${props => props.background || "blue"};
  border: 0;
  color: #fff;
  padding: 11px;
  margin: 0 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 50ms ease-in-out;
  box-sizing: border-box;
  align-items: center;

  svg{
    height: 20px;
    margin-right: 6px;
  }

  ${props =>
    props.size === "large" &&
    css`
      font-size: 1.2rem;
      padding: 10px 15px;
    `}
  ${props =>
    props.size === "medium" &&
    css`
      font-size: 1.1rem;
      padding: 6px 11px;
    `}
  ${props =>
    props.size === "small" &&
    css`
      font-size: 0.9rem;
      padding: 3px 7px;
    `}

    &:hover{
        transform:scale(1.1);
        
    }
`;

const StyledButtonPrimary = styled.button`
  ${buttonStyles};
  background-color: ${props => props.background};
  color:${props => props.background === "white" ? "black" : "white"};
  &:hover{
    background-color: ${props => props.background === "white" ? props.background : "blue"};
    font-weight:${props => props.background === "white" ? "bold" : "normal"}
  }
`;

const StyledButtonNeutral = styled.button`
  ${buttonStyles};
  background-color: #000;
  color: #f3eaea;
  border: 0.1px solid white;
`;

export default function PrimaryButton({ children, ...rest }: any) {
  return <StyledButtonPrimary {...rest}>{children}</StyledButtonPrimary>;
};

export const NeutralButton = ({ children, ...rest }: any) => {
  return <StyledButtonNeutral {...rest}>{children}</StyledButtonNeutral>;
};
