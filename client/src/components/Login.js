import React, { Component } from 'react'
import { Button, Form, Message, Loader } from 'semantic-ui-react'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;
`

const Label = styled.h1`
  text-align: center;
`

const Header = styled.div`
  padding-top: 15px;
  font-size: 20px;
  font-weight: bold;
`

const Body = styled.div`
  padding-top: 10px;
  font-size: 17px;
`

const Footer = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding-top: 10px;
`

export default class Login extends Component {

  state = {
    username: '',
    password: '',
    isLoading: false,
  }

  //login with simple validation
  login = e => {
    e.preventDefault()
    const { username, password } = this.state
    if (username.length < 2 || password.length < 6) {
      alert('Invalid Submission')
    } else {
      this.setState({ isLoading: true })
      axios.post('/api/user/login', {
        username: this.state.username.toLowerCase(),
        password: this.state.password,
      })
      .then(res => {
        localStorage.setItem('user_id', res.data.user_id)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('isAuth', 'true')
        this.props.history.push('/home')
      })
      .catch(err => {
        if (err.response.data === 'login failed') {
          this.setState({ isLoading: false })
          alert('Invalid email or password')
        }
      })
    }
  }
  
  render() {
    return (
      <Container>
        <Form onSubmit={this.login}>
          <Label>Log in to Tweeper</Label>
          <Form.Field>
            <input placeholder='Username' onChange={e => {this.setState({ username: e.target.value })}}/>
          </Form.Field>
          <Form.Field>
            <input type='password' placeholder='Password' onChange={e => {this.setState({ password: e.target.value })}}/>
          </Form.Field>
          {this.state.isLoading === false ? (
            <Button fluid primary>LOG IN</Button>
          ) : (
            <Loader active inline='centered' />
          )}
        </Form>
        <Message style={{textAlign: 'right'}}>
          New to us? <Button size='mini' onClick={this.props.event}>Sign Up</Button>
        </Message>
        <Header>*DISCLAIMER</Header>
        <Body>This application is for project and educational purposes 
        only to practice full stack development. No copyright infringement 
        intended towards Twitter.</Body>
        <Footer>- Jawyn Sunga</Footer>
      </Container>
    )
  }

}