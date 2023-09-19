import styled from "styled-components"
const Box = styled.div`
    background-color: #fff;
    padding: 0.6rem;
`

export default function ProductBox({product,images}:any){
    return(
        <Box>
            <img src={images[0]} alt="" />
            {product.title}
        </Box>
    )
}