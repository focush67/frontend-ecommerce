import {
  CardWrapper,
  CardImage,
  CardTextWrapper,
  CardTextDate,
  CardTextTitle,
  CardTextBody,
  CardStatWrapper,
  CardStats,
  LinkText
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
          <CardTextTitle>{price}</CardTextTitle>
        </CardTextWrapper>
        <CardStatWrapper>
          
        </CardStatWrapper>
      </CardWrapper>
    </Tilt>
  );
};
