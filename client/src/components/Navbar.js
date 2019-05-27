import React, { Component } from 'react'
import { Button, Search } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

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

const Left = styled.div`
  width: 50%;
`

const Right = styled.div`
  width: 50%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
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

const Logout = styled(Button)`
  && {
    float: right;
    margin-top: 11px;
    margin-left: 20px;
  }
`

const Nav = styled(NavLink)`
  color: white;
  :hover {
    text-decoration: underline;
    color: white;
  }
`

const searchStyle = {
  float: 'right',
  marginTop: '6px',
}

export default class Navbar extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    username: '',
  }

  componentDidMount() {
    axios.get(`/api/user/get/${this.state.user_id}`)
    .then(res => {
      this.setState({ username: res.data.username })
    })
    .catch(err => {
      console.log(err)
    })
  }

  logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('isAuth')
    this.props.history.push('/')
  }

  render() {

    return (
      <Container>
        <Wrapper>
          <Left>
            <Link><Nav to="/home">Home</Nav></Link>
            <Link><Nav to="/messages">Messages</Nav></Link>
            <Link><Nav to={`/user/${this.state.username}`}>Profile</Nav></Link>
          </Left>
          <Right>
            <Logout size='mini' onClick={this.logout}>Logout</Logout>
            <Search style={searchStyle}/>
          </Right>
        </Wrapper>
      </Container>
    )
    
  }
}