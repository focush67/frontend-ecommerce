// @components/CartStyles.js (or .jsx)
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 20px;
`;

export const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #f2f2f2;
  border-bottom: 2px solid #ccc;
  font-weight: bold;
  text-transform: uppercase;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f5f5f5;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
`;

export const QuantityCell = styled.td`
  display: flex;
  align-items: center;
  padding: 10px;

  button {
    background-color: #007bff;
    color: #fff;
    border: none;
    width: 30px;
    height: 30px;
    font-size: 1rem;
    cursor: pointer;
  }

  span {
    margin: 0 10px;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

export const TotalCell = styled.td`
  font-weight: bold;
  padding: 10px;
  font-size: 1.2rem;
`;

export const ActionCell = styled.td`
  padding: 10px;

  button {
    background-color: #ab2626;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export const EmptyCartMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin: 20px 0;
`;

export const CheckoutButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

export const ProceedToCheckoutButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.2rem;
`;

export const EmptyCartButton = styled.button`
  background-color: #ab2626;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.2rem;
`;
