import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, StyledButton } from './StyledLaddingPage'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <Container>
      <Title>Bem-vindo à Landing Page</Title>
      <StyledButton onClick={() => navigate('/home')}>
        Ir para Home
      </StyledButton>
    </Container>
  )
}

export default Landing
