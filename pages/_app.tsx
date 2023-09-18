import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Mooli&display=swap');
  body{
    padding:0;
    margin: 0;
    font-family: 'Mooli' , sans-serif;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
    <GlobalStyles />
    <Component {...pageProps}/>
    </>
  )
}
