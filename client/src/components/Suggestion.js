import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: white;
  margin-left: 10px;
  height: 205px;
`

const Header = styled.div`
  padding-top: 15px;
  padding-left: 15px;
  font-size: 20px;
  font-weight: bold;
`

const Body = styled.div`
  padding-left: 15px;
  padding-top: 10px;
  font-size: 17px;
`

const Footer = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding-top: 10px;
  padding-left: 15px;
`

export default class Suggestion extends Component {
  render() {
    return (
      <Container>
        <Header>DISCLAIMER</Header>
        <Body>This application is for project and educational purposes 
        only to practice full stack development. No copyright infringement 
        intended towards Twitter.</Body>
        <Footer>- Jawyn Sunga</Footer>
      </Container>
    )
  }
}
