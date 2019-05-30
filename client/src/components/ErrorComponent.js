import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 600px;
  margin: 0 auto;
  margin-top: 50px;
`

const Header = styled.h1`
  font-size: 100px;
  text-align: center;
`

const Body = styled.h1`
  font-size: 30px;
  text-align: center;
`

const ErrorComponent = () => {
  return (
    <Container>
      <Header>404</Header>
      <Body>Oops! This page does not exist..</Body>
    </Container>
  )
}

export default ErrorComponent