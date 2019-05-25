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

export default class Register extends Component {

  state = {
    username: '',
    firstname: '',
    lastname: '',
    password: '',
  }

  register = e => {
    e.preventDefault()
    const { username, firstname, lastname, password } = this.state
    if (username.length < 2 || firstname.length < 2 || lastname.length < 2 || password.length < 6) {
      alert('Invalid Submission')
    } else {
      console.log('register')
    }
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.register}>
          <Label>Create an account</Label>
          <Form.Field>
            <input placeholder='*Username' onChange={e => {this.setState({ username: e.target.value })}}/>
          </Form.Field>
          <Form.Field>
            <input placeholder='*First Name' onChange={e => {this.setState({ firstname: e.target.value })}}/>
          </Form.Field>
          <Form.Field>
            <input placeholder='*Last Name' onChange={e => {this.setState({ lastname: e.target.value })}}/>
          </Form.Field>
          <Form.Field>
            <input type='password' placeholder='*Password' onChange={e => {this.setState({ password: e.target.value })}}/>
          </Form.Field>
          <Form.Field>
            <Checkbox label='I agree to the TERMS AND CONDITIONS' />
          </Form.Field>
          <Button fluid primary>SIGN UP</Button>
        </Form>
        <Message style={{textAlign: 'right'}}>
          Already have an account? <Button size='mini' onClick={this.props.event}>Log In</Button>
        </Message>
      </Container>
    )
  }
}