import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import Login from './Login'
import Register from './Register'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
`

const Left = styled.div`
  width: 50%;
  height: 100vh;
  background-color: #2185d0;
  background-image: linear-gradient(#2185d0, #a8d9ff);
`

const Right = styled.div`
  width: 50%;
`

const Wrapper = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 440px;
`

const Detail = styled.h1`
  color: white;
  font-size: 25px;
  padding-bottom: 20px;
`

const Header = styled.h1`
  color: white;
  font-size: 50px;
  padding-bottom: 20px;
`

export default class Home extends Component {

  state = {
    render: 'login',
  }

  register = () => {
    this.setState({ render: 'register' })
  }

  login = () => {
    this.setState({ render: 'login' })
  }

  getRender = () => {
    if (this.state.render === 'login') {
      return <Login event={this.register}/>
    } else {
      return <Register event={this.login}/>
    }
  }

  render() {
    //desktop view only for now
    return (
      <Container>
        <Left>
          <Wrapper>
            <Header><Icon name='earlybirds' style={{marginRight: '10px'}}/>Tweeper</Header>
            <Detail><Icon name='users' style={{marginRight: '10px'}}/>Follow your interests</Detail>
            <Detail><Icon name='desktop' style={{marginRight: '10px'}}/>Hear what people are talking about</Detail>
            <Detail><Icon name='chat' style={{marginRight: '10px'}}/>Join the conversation</Detail>
          </Wrapper>
        </Left>
        <Right>
          {this.getRender()}
        </Right>
      </Container>
    )
  }
}