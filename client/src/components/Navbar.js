import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  position: sticky;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: #2185d0;
  box-shadow: 0px 3px 3px grey;
  display: flex;
  flex-direction: row;
`

const Wrapper = styled.div`
  width: 1200px
  margin: 0 auto;
`

const Link = styled.div`
  color: white;
  font-size: 17px;
  display: inline-block;
  margin-top: 15px;
  margin-right: 40px;
`

const StyledButton = styled(Button)`
  && {
    float: right;
    margin-top: 7px;
  }
`

const Nav = styled(NavLink)`
  color: white;
  :hover {
    text-decoration: underline;
    color: white;
  }
`

export default class Navbar extends Component {
  render() {
    return (
      <Container>
        <Wrapper>
          <Link><Nav to="/">Home</Nav></Link>
          <Link><Nav to="/messages">Messages</Nav></Link>
          <Link><Nav to="/profile">Profile</Nav></Link>
          <StyledButton inverted>Tweep</StyledButton>
        </Wrapper>
      </Container>
    )
  }
}