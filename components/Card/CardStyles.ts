import styled from "styled-components";

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: "image text" "image stats";
  border-radius: 18px;
  background: #000;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.9);
  text-align: center;
  padding: 2rem;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas: "image text" "image stats";
  }
`;

export const CardImage = styled.div<{ background: string }>`
  grid-area: image;
  background-image: url(${({ background }) => background});
  border-top-left-radius: 1rem;
  border-top-right-radius: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: 100%;
`;

export const CardTextWrapper = styled.div`
  grid-area: text;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  max-height: 60vh;
  justify-content: space-around;

  @media (min-width: 600px) {
    padding-left: 1rem;
  }
`;

export const CardTextDate = styled.span`
  color: rgb(255, 7, 110);
  font-size: 13px;
`;

export const CardTextTitle = styled.h2`
  margin-top: 0px;
  font-size: 2rem;
  box-sizing: border-box;
  min-width: 0px;
  line-height: 1.2;
  margin: 0px;
  margin-bottom: 1rem;
  background: linear-gradient(
    110.78deg,
    rgb(118, 230, 80) -1.13%,
    rgb(249, 214, 73) 15.22%,
    rgb(240, 142, 53) 32.09%,
    rgb(236, 81, 87) 48.96%,
    rgb(255, 24, 189) 67.94%,
    rgb(26, 75, 255) 85.34%,
    rgb(98, 216, 249) 99.57%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  
`;

export const CardTextBody = styled.p`
  color: grey;
  font-size: 15px;
  font-weight: 300;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const CardStatWrapper = styled.div`
  grid-area: stats;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const CardStats = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  color: white;
`;

export const LinkText = styled.a`
  color: #fff;
  text-decoration: none;
`;

export const PropertyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1px;
`;

export const PropertyName = styled.div`
  display: flex;
  font-size: large;
  font-weight: bold;
  color: transparent;
  color: #ccc;
  align-items: center;
  margin-bottom: 0.5em;
`;

export const PropertyValue = styled.div`
  align-items: center;
  margin-left: 1em;
  margin-bottom: 0.5em;
  font-size: large;
  color: gray;
`