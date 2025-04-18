import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, StyledButton } from './StyledHome'

const Home = () => {
  const navigate = useNavigate()

  return (
    <Container>
      <Title>Você está na Home!</Title>
      <StyledButton onClick={() => navigate('/')}>
        Voltar para Landing Page
      </StyledButton>
    </Container>
  )
}

export default Home
