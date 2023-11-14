import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";
import { useContext, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import PrimaryButton, { NeutralButton } from "./Buttons";
import { HiMenu } from "react-icons/hi";
import Drawer from "@mui/material/Drawer";

const StyledHeader = styled.header`
  background-color: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
`;

const Logo = styled(Link)<{ disablepointerevents?: boolean }>`
  color: #aaa;
  text-decoration: none;
  transition: transform 150ms ease-in;

  &:hover {
    transform: scale(1.1);
    color: #fff;
    font-weight: 500;
  }

  /* Apply pointer-events: none when totalItems is 0 */
  pointer-events: ${({ disablepointerevents }) =>
    disablepointerevents ? "none" : "auto"};
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

  @media (max-width: 550px) {
    display: none;
  }
`;

const HiMenuWrapper = styled.div`
  display: none;
  @media (max-width: 550px) {
    display: block;
  }
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

interface Profile {
  name: String;
  image: String;
  email: String;
}

const ProfileInfoWrapper = styled.div<{ signedIn?: boolean }>`
  pointer-events: ${({ signedIn }) => (signedIn ? "none" : "auto")};
`;

export default function Header({ profile, initialTotalItems }: any) {
  const [open, setOpen] = useState(false);
  const { cart, clearCart } = useContext(CartContext);
  const signOutAndClearStorage = async () => {
    clearCart();
    await signOut();
  };

  const totalItems =
    Object.values(cart).reduce(
      (total: number, quantity: any) => total + parseInt(quantity),
      0
    ) || initialTotalItems;

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <StyledHeader>
        <Center>
          <Wrapper>
            <Logo href={"/"}>ECommerce</Logo>
            <HiMenuWrapper>
              <HiMenu
                style={{
                  color: "white",
                }}
                onClick={toggleDrawer}
              />
            </HiMenuWrapper>
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

      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <div style={{ width: "50vw" , padding:"2em", margin:"0 auto" , display:"flex" , alignItems:"center" , justifyContent:"flex-start"}}>
          <div style={{padding: "2em", display:"flex", flexDirection:"column" , gap:"2rem" }}>
            <Logo href={"/"} style={{color:"black"}}>Home</Logo>
            <Logo href={"/products"} style={{color:"black"}}>Products</Logo>
            <Logo href={"/categories"} style={{color:"black"}}>Categories</Logo>
            <Logo
              href={"/cart"}
              className="cart"
              disablepointerevents={totalItems === 0}
              style={{color:"black"}}
            >
              Cart ({totalItems || 0})
            </Logo>
            <Logo href={"/myorders"} style={{color:"black"}}>Orders</Logo>
            {!profile ? (
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
          </div>
        </div>
      </Drawer>
    </>
  );
}

export async function getServerSideProps() {
  const initialTotalItems = calculateInitialTotalItems();
  return {
    props: {
      initialTotalItems,
    },
  };
}

function calculateInitialTotalItems() {
  if (!localStorage.getItem("user_cart")) {
    return 0;
  }

  const totalItemsInCart = localStorage.getItem("user_cart")?.length;
  return totalItemsInCart;
}
