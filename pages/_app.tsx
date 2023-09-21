import type { AppProps } from "next/app";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Mooli&display=swap');
  body{
    background-color: #e1dada;
    padding:0;
    margin: 0;
    font-family: 'Mooli' , sans-serif;
  }
`;

const ScrollaleContainer = styled.div`
  max-height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar{
    width:10px;
  }

  &::-webkit-scrollbar-thumb{
    background-color: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track:hover{
    background-color: #555;
  }
`

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <>
    <time dateTime="2023-09-20" suppressHydrationWarning/>
    <ScrollaleContainer>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </ScrollaleContainer>
    </>
  );
}
