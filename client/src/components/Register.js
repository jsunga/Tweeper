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
  render() {
    return (
      <Container>
        <Form onSubmit={this.login}>
          <Label>Create an account</Label>
          <Form.Field>
            <input placeholder='Username' />
          </Form.Field>
          <Form.Field>
            <input placeholder='First Name' />
          </Form.Field>
          <Form.Field>
            <input placeholder='Last Name' />
          </Form.Field>
          <Form.Field>
            <input type='password' placeholder='Password' />
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