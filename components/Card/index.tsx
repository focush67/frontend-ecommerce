import {
  CardWrapper,
  CardImage,
  CardTextWrapper,
  CardTextTitle,
  CardTextBody,
  CardStatWrapper,
} from "./CardStyles";
import Tilt from "react-parallax-tilt";

export const Card = ({ title, description , price , imgUrl }: any) => {
  return (
    <Tilt>
      <CardWrapper>
        <CardImage background={imgUrl} />
        <CardTextWrapper>
          <CardTextTitle>{title}</CardTextTitle>
          <CardTextBody>
            {description}
          </CardTextBody>
          
          <CardTextTitle>₹ {price}</CardTextTitle>
        </CardTextWrapper>
        <CardStatWrapper>
          
        </CardStatWrapper>
      </CardWrapper>
    </Tilt>
  );
};
