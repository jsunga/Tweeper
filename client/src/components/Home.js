import React, { Component } from 'react'
import { Placeholder, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import Summary from './Summary'
import Suggestion from './Suggestion'
import Feed from './Feed'
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
  height: 205px;
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

const PlaceholderWrapper = styled.div`
  background-color: white;
  margin-right: 10px;
  height: 205px;
  padding: 15px;
`

export default class Home extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    isAuth: localStorage.getItem('isAuth'),
    user_details: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = () => {
    axios.get(`/api/user/get/${this.state.user_id}`)
    .then(res => {
      let data = res.data
      data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
      data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
      this.setState({ user_details: data, isLoading: false })
    })
    .catch(err => {
      console.log(err)
    })
  }

  getRender = () => {
    if (this.state.isLoading === true) {
      return (
        <PlaceholderWrapper>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
        </PlaceholderWrapper>
      )
    } else {
      return (
        <>
          <Summary {...this.state}/>
          <Button style={{width: '295px'}}>Edit Profile</Button>
        </>
      )
    }
  }

  render() {
    if (this.state.isAuth !== 'true') {
      return <Redirect to="/"/>
    }
    return (
      <>
        <style>{'body { background-color: #e6ecf0; }'}</style>
        <Navbar {...this.props}/>
        <Container>
          <ProfileWrapper>{this.getRender()}</ProfileWrapper>
          <FeedWrapper><Feed {...this.props}/></FeedWrapper>
          <SuggestionWrapper><Suggestion/></SuggestionWrapper>
        </Container>
      </>
    )
  }
  
}