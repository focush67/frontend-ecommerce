import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
const StyledHeader = styled.header`
  background-color: #000;
`;

const Logo = styled(Link)`
  color: #aaa;
  text-decoration: none;
  transition: transform 150ms ease-in;
  &:hover{
    transform: scale(1.1);
    color: #fff;
    font-weight: 500;
  }
`;

const Wrapper = styled.div`
  display: flex;
  padding: 20px 2rem;
  font-size: 1.1rem;
  gap: 2rem;
  justify-content: space-between;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 1rem;
  text-decoration: none;
`;

export default function Header() {
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>ECommerce</Logo>
          <StyledNav>
            <Logo href={"/"}>Home</Logo>
            <Logo href={"/products"}>All Products</Logo>
            <Logo href={"/categories"}>Categories</Logo>
            <Logo href={"/account"}>Account</Logo>
            <Logo href={"/cart"}>Cart (0)</Logo>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
