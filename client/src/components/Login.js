import React, { Component } from 'react'
import { Button, Checkbox, Form, Message } from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;
`

const Label = styled.h1`
  text-align: center;
`

export default class Login extends Component {

  state = {
    username: '',
    password: '',
  }

  login = e => {
    e.preventDefault()
    const { username, password } = this.state
    if (username.length < 2 || password.length < 6) {
      alert('Invalid Submission')
    } else {
      console.log('login')
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
          <Form.Field>
            <Checkbox label='Remember me' />
          </Form.Field>
          <Button fluid primary>LOG IN</Button>
        </Form>
        <Message style={{textAlign: 'right'}}>
          New to us? <Button size='mini' onClick={this.props.event}>Sign Up</Button>
        </Message>
      </Container>
    )
  }
}