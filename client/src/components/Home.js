import React, { Component } from 'react'
import { TextArea, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import Summary from './Summary'
import Suggestion from './Suggestion'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 1210px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`

const ProfileWrapper = styled.div`
  width: 305px;
  margin-top: 15px;
`

const FeedWrapper = styled.div`
  width: 600px;
  background-color: white;
  margin-top: 15px;
`

const SuggestionWrapper = styled.div`
  width: 305px;
  margin-top: 15px;
`

const Tweep = styled.div`
  margin: 20px;
`

const Body = styled.div`
  background-color: #e6ecf0;
  height: 100vh;
`

const buttonStyle = {
  float: 'right',
  marginRight: '6px'
}

export default class Home extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    isAuth: localStorage.getItem('isAuth'),
    tweep: '',
    user_details: [],
  }

  componentDidMount() {
    axios.get(`/api/user/get/${this.state.user_id}`)
    .then(res => {
      let data = res.data
      data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
      data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
      this.setState({ user_details: data })
    })
    .catch(err => {
      console.log(err)
    })
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
          <ProfileWrapper><Summary {...this.state}/></ProfileWrapper>
          <FeedWrapper>
            <Tweep>
              <TextArea rows={5} placeholder={`What's happening?`} style={{width: '550px', resize: 'none'}} value={this.state.tweep} onChange={e => {this.setState({ tweep: e.target.value })}}/>
              <Button primary style={buttonStyle} onClick={this.tweep}>Tweep</Button>
            </Tweep>
          </FeedWrapper>
          <SuggestionWrapper><Suggestion/></SuggestionWrapper>
        </Container>
      </Body>
    )
  }
}