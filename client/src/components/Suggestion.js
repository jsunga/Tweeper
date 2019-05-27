import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: white;
  margin-left: 10px;
  height: 195px;
`

const Header = styled.h2`
  text-align: center;
  padding: 5px;
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
