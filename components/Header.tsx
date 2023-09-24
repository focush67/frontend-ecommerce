import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";
import {useContext} from 'react';
import { CartContextType } from "./Featured";
import { signIn, signOut } from "next-auth/react";
import PrimaryButton, { NeutralButton } from "./Buttons";
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
  padding: 20px 0.7rem;
  font-size: 1.1rem;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
  flex-basis: content;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 1rem;
  text-decoration: none;
  align-items: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius:50%;
  margin: 0 5px 0;
`;

const ProfileInfoWrapper = styled.div`
  pointer-events: ${({ signedIn }) => (signedIn ? "none" : "auto")};
`

export default function Header({profile}:any) {
  const {cart} = useContext<CartContextType>(CartContext);
  const totalItemsInCart = Object.values(cart).reduce((total,quantity)=>total+parseInt(quantity,10),0);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>ECommerce</Logo>
          <StyledNav>
            <Logo href={"/"}>Home</Logo>
            <Logo href={"/products"}>Products</Logo>
            <Logo href={"/categories"}>Categories</Logo>
            <Logo href={"/cart"}>Cart ({totalItemsInCart})</Logo>
            {
              profile ? (
                <ProfileInfoWrapper>
                  <ProfileInfo>
                  <Avatar src={profile.image} alt="image"/>
                  <NeutralButton size="medium" background="white" onClick={()=>signOut()}>Logout</NeutralButton>
                </ProfileInfo>
                </ProfileInfoWrapper>
              ):(
                <>
                <Logo href={"/account"}>Account</Logo>
                <PrimaryButton background="green" size="medium" onClick={()=>signIn("google")}>Login</PrimaryButton>
                </>
              )
            }
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
