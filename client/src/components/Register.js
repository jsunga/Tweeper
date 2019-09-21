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

export default class Register extends Component {

  state = {
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    isLoading: false,
  }

  //create an account with simple validation
  register = e => {
    e.preventDefault()
    const { username, firstname, lastname, password } = this.state
    if (username.length < 2 || firstname.length < 2 || lastname.length < 2 || password.length < 6) {
      alert('Invalid Submission')
    } else {
      this.setState({ isLoading: true })
      axios.post('/api/user/register', {
        username: this.state.username.toLowerCase(),
        firstname: this.state.firstname.toLowerCase(),
        lastname: this.state.lastname.toLowerCase(),
        password: this.state.password,
      })
      .then(res => {
        localStorage.setItem('user_id', res.data.user_id)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('isAuth', 'true')
        this.props.history.push('/home')
      })
      .catch(err => {
        if (err.response.data === 'username already used') {
          this.setState({ isLoading: false })
          alert('Username already used')
        }
      })
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
          {this.state.isLoading === false ? (
            <Button fluid primary>SIGN UP</Button>
          ) : (
            <Loader active inline='centered' />
          )}
        </Form>
        <Message style={{textAlign: 'right'}}>
          Already have an account? <Button size='mini' onClick={this.props.event}>Log In</Button>
        </Message>
      </Container>
    )
  }
  
}