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

export default class Suggestion extends Component {
  render() {
    return (
      <Container>
        <Header>Who to follow</Header>
      </Container>
    )
  }
}