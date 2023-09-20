import type { AppProps } from "next/app";
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

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <>
    <time dateTime="2023-09-20" suppressHydrationWarning/>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </>
  );
}
