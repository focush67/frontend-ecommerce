import styled from "styled-components"
import { ReactNode } from "react";
const StyledDiv = styled.div`
  max-width : 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

export default function Center({children}:{children:ReactNode}){
    return(
        <StyledDiv>{children}</StyledDiv>
    )
}