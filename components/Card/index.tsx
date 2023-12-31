import {
  CardWrapper,
  CardImage,
  CardTextWrapper,
  CardTextTitle,
  CardTextBody,
  CardStats,
  CardStatWrapper,
  PropertyName,
  PropertyValue,
  PropertyWrapper,
} from "./CardStyles";
import Tilt from "react-parallax-tilt";

export const Card = ({ title, description , price , imgUrl, properties}: any) => {
  return (
    <Tilt>
      <CardWrapper>
        <CardImage background={imgUrl}  />
        <CardTextWrapper>
          <CardTextTitle>₹ {price}</CardTextTitle>
          <CardTextTitle>{title}</CardTextTitle>
          <CardTextBody>{description}</CardTextBody>
        </CardTextWrapper>
        <CardStatWrapper>
          <CardStats>
            {properties.map((property: any, index: number) => (

              <PropertyWrapper key={index}>
                <PropertyName>{property.name}:</PropertyName>
                <PropertyValue>{property.value}</PropertyValue>
              </PropertyWrapper>
            ))}
          </CardStats>
        </CardStatWrapper>
      </CardWrapper>
    </Tilt>
  );
};