import styled from "styled-components";
import Center from "./Center";
import PrimaryButton, { NeutralButton } from "./PrimaryButton";

const Bg = styled.div`
  position: relative;
  background-color: #000;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;

const Description = styled.p`
  color: #aaa;
  font-size: 0.8rem;
  z-index: 2;
`;

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  img {
    max-width: 100%;
    border-radius: 1rem;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0 0 0;
`;

export default function Featured() {
  return (
    <Bg>
      <Center>
        <Wrapper>
          <Column>
            <div>
              <Title>Pro Anywhere</Title>
              <Description>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                ipsum quis, obcaecati, cumque necessitatibus magnam dolore iusto
                dolorem nemo officiis quidem, vero nulla ducimus veniam sint id.
                Provident, aspernatur velit.
              </Description>
              <Column>
                <NeutralButton size="medium">Read More</NeutralButton>
                <PrimaryButton size="medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  Add to Cart
                </PrimaryButton>
              </Column>
            </div>
          </Column>
          <div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/admin-panel-20a9b.appspot.com/o/MacBook%20Pro%20Z14V0016E%2Flappi2.webp4f1073b2-39da-4852-8d75-b687c78e7d47?alt=media&token=b84ae8fa-09b1-4cbc-8c48-9038120915a4"
              alt=""
            />
          </div>
        </Wrapper>
      </Center>
    </Bg>
  );
}
