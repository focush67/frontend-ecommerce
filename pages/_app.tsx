import type { AppProps } from "next/app";
import React from "react";
import { SessionProvider } from "next-auth/react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
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

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track:hover {
    background-color: #555;
  }
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <ScrollaleContainer>
          <GlobalStyles />
          <CartContextProvider>
            <ErrorBoundary>
            <Component {...pageProps} suppressHydrationWarning />
            </ErrorBoundary>
          </CartContextProvider>
        </ScrollaleContainer>
      </SessionProvider>
    </>
  );
}
