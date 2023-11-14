import {
  CardWrapper,
  CardImage,
  CardTextWrapper,
  CardTextTitle,
  CardTextBody,
  CardStats,
  CardStatWrapper,
<<<<<<< HEAD
  CardStats,
  PropertyName,
  PropertyValue,
  PropertyWrapper,
} from "./CardStyles";
import Tilt from "react-parallax-tilt";

export const Card = ({ title, description , price , imgUrl, properties }: any) => {
=======
  PropertyWrapper,
  PropertyName,
  PropertyValue,
} from "./CardStyles";
import Tilt from "react-parallax-tilt";

export const Card = ({ title, description , price , imgUrl, properties}: any) => {
>>>>>>> 0abbb918e9624cd0b37df8711dcaa3ec0326bf9f
  return (
    <Tilt>
      <CardWrapper>
        <CardImage background={imgUrl} />
        <CardTextTitle>₹ {price}</CardTextTitle>
        <CardTextWrapper>
          <CardTextTitle>{title}</CardTextTitle>
          <CardTextBody>{description}</CardTextBody>
        </CardTextWrapper>
        <CardStatWrapper>
<<<<<<< HEAD
          
        <CardStats>
            {properties?.map((property: any, index: number) => (
=======
          <CardStats>
            {properties.map((property: any, index: number) => (
>>>>>>> 0abbb918e9624cd0b37df8711dcaa3ec0326bf9f
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
