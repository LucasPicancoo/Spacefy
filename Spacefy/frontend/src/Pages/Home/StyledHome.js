import styled from 'styled-components'
import { COLORS } from "../../Constants/colors"; // Esta dando erro ao utilizar as cores no codigo

export const Container = styled.div`
  padding: 2rem;
  text-align: center;
`

export const Title = styled.h1`
  color: #333;
`

export const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #4e7eff;
  border: none;
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #345bdd;
  }
`
