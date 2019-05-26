import React, { Component } from 'react'
import { TextArea, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`

const Profile = styled.div`
  width: 305px;
`

const Feed = styled.div`
  width: 590px;
  background-color: white;
  box-shadow: 0px 1px 1px #c9c7c7;
`

const Follow = styled.div`
  width: 305px;
`

const Tweep = styled.div`
  text-align: center;
  margin-top: 15px;
`

const Body = styled.div`
  background-color: #e6ecf0;
  height: 100vh;
`

const buttonStyle = {
  float: 'right',
  marginRight: '20px',
  marginTop: '5px',
  marginBottom: '10px'
}

export default class Home extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    isAuth: localStorage.getItem('isAuth'),
    tweep: '',
  }

  tweep = () => {
    if (this.state.tweep.length === 0) {
      alert('No empty tweep')
    } else {
      axios.post('/api/tweep', {
        content: this.state.tweep
      })
      .then(() => {
        this.setState({ tweep: '' })
        console.log('success')
      })
      .catch(err => {
        console.log(err.response.data)
      })
    }
  }

  render() {
    if (this.state.isAuth !== 'true') {
      return <Redirect to="/"/>
    }
    return (
      <Body>
        <Navbar {...this.props}/>
        <Container>
          <Profile></Profile>
          <Feed>
            <Tweep>
              <TextArea rows={5} placeholder={`What's happening?`} style={{width: '550px'}} value={this.state.tweep} onChange={e => {this.setState({ tweep: e.target.value })}}/>
              <Button primary style={buttonStyle} onClick={this.tweep}>Tweep</Button>
            </Tweep>
          </Feed>
          <Follow></Follow>
        </Container>
      </Body>
    )
  }
}