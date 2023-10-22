import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";
import { useContext } from "react";
import { signIn, signOut } from "next-auth/react";
import PrimaryButton, { NeutralButton } from "./Buttons";
const StyledHeader = styled.header`
  background-color: #000;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)<{disablepointerevents?:boolean}>`
  color: #aaa;
  text-decoration: none;
  transition: transform 150ms ease-in;

  &:hover {
    transform: scale(1.1);
    color: #fff;
    font-weight: 500;
  }

  /* Apply pointer-events: none when totalItems is 0 */
  pointer-events: ${({disablepointerevents}) => disablepointerevents ? "none" : "auto"};
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
  border-radius: 50%;
  margin: 0 5px 0;
`;

interface Profile{
  name: String,
  image: String,
  email: String,
};

const ProfileInfoWrapper = styled.div<{signedIn?:boolean}>`
  pointer-events: ${({ signedIn }) => (signedIn ? "none" : "auto")};
`;

export default function Header({profile,initialTotalItems}:any) {
  const { cart, clearCart } = useContext(CartContext);
  const signOutAndClearStorage = async () => {
    clearCart();
    await signOut();
  };

  const totalItems = Object.values(cart).reduce(
    (total:number, quantity:any) => total + parseInt(quantity),
    0
  ) || initialTotalItems;

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>ECommerce</Logo>
          <StyledNav>
            <Logo href={"/"}>Home</Logo>
            <Logo href={"/products"}>Products</Logo>
            <Logo href={"/categories"}>Categories</Logo>
            <Logo
              href={"/cart"}
              className="cart"
              disablepointerevents={totalItems === 0}
            >
              Cart ({totalItems || 0})
            </Logo>
            <Logo href={"/myorders"}>Orders</Logo>
            {!profile ? ( // Check if email (or any other property) is missing
              <PrimaryButton
                background="green"
                size="medium"
                onClick={() => signIn("google")}
              >
                Login
              </PrimaryButton>
            ) : (
              <ProfileInfoWrapper>
                <ProfileInfo>
                  <Avatar src={profile?.image} alt="A" />
                  <NeutralButton
                    size="medium"
                    background="white"
                    onClick={() => signOutAndClearStorage()}
                  >
                    Logout
                  </NeutralButton>
                </ProfileInfo>
              </ProfileInfoWrapper>
            )}
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}


export async function getServerSideProps(){
  const initialTotalItems = calculateInitialTotalItems();
  return{
    props:{
      initialTotalItems,
    },
  }
}

function calculateInitialTotalItems(){
  if(!localStorage.getItem("user_cart")){
    return 0;
  }
  
  const totalItemsInCart = localStorage.getItem("user_cart")?.length;
  return totalItemsInCart;
}
