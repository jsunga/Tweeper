import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import Summary from './Summary'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`

const ProfileWrapper = styled.div`
  width: 305px;
  margin-top: 15px;
`

const FeedWrapper = styled.div`
  width: 750px;
  background-color: white;
  margin-top: 15px;
`

const Tweep = styled.div`
  text-align: center;
  margin-top: 20px;
`

const Body = styled.div`
  background-color: #e6ecf0;
  height: 100vh;
`

export default class Profile extends Component {

  state = {
    user_details: [],
    tweeps: [],
    user_id: localStorage.getItem('user_id'),
    isAuth: localStorage.getItem('isAuth'),
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    const { handle } = this.props.match.params
    this.getUser(handle)
  }

  getUser = handle => {
    axios.get(`/api/user/retrieve/${handle}`)
    .then(res => {
      if (res.data.length === 0) {
        this.props.history.push('/404')
      } else {
        let data = res.data
        data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
        data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
        this.setState({ user_details: data })
        axios.get(`/api/tweep/get/${this.state.user_details.user_id}`)
        .then(res => {
          console.log(res.data)
          this.setState({ tweeps: res.data })
        })
        .catch(err => {
          console.log(err)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
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
          <FeedWrapper></FeedWrapper>
        </Container>
      </Body>
    )
    
  }
}
