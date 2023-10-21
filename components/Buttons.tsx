import styled, { css } from "styled-components";

interface ButtonProps{
  children: React.ReactNode;
  background: string;
  size: "small" | "medium" | "large";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const buttonStyles = css`
  display: inline-flex;
  background-color: ${(props:any) => props.background || "blue"};
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

  ${(props:any) =>
    props.size === "large" &&
    css`
      font-size: 1.2rem;
      padding: 10px 15px;
    `}
  ${(props:any) =>
    props.size === "medium" &&
    css`
      font-size: 1.1rem;
      padding: 6px 11px;
    `}
  ${(props:any) =>
    props.size === "small" &&
    css`
      font-size: 0.9rem;
      padding: 3px 7px;
    `}
`;

const StyledButtonPrimary = styled.button<ButtonProps>`
  ${buttonStyles};
  background-color: ${(props:any) => props.background === "white" ? "transparent" : props.background};
  border: ${(props:any) => props.background === "white" ? "2px solid blue" : "none"};
  color:${(props:any) => props.background === "white" ? "blue" : "white"};
  
`;

const StyledButtonNeutral = styled.button<ButtonProps>`
  ${buttonStyles};
  background-color: #000;
  color: #f3eaea;
  border: 0.1px solid white;
  justify-content: center;
`;

export default function PrimaryButton({ children, ...rest }: any) {
  return <StyledButtonPrimary {...rest}>{children}</StyledButtonPrimary>;
};

export const NeutralButton = ({ children, ...rest }: any) => {
  return <StyledButtonNeutral {...rest}>{children}</StyledButtonNeutral>;
};

