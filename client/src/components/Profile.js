import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`

const Profiler = styled.div`
  width: 305px;
  margin-top: 15px;
`

const Feed = styled.div`
  width: 750px;
  background-color: white;
  box-shadow: 0px 1px 1px #c9c7c7;
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

const Details = styled.div`
  background-color: white;
  box-shadow: 0px 1px 1px #c9c7c7;
  margin-right: 10px;
`

const Image = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`

const Picture = styled.div`
  padding-top: 10px;
  text-align: center;
`

const Name = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-left: 14px;
`

const Username = styled.div`
  padding-left: 12px;
  padding-top: 5px;
`

const Stats = styled.div`
  margin-top: 10px;
  width: 290px;
  display: flex;
  flex-direction: row;
  padding-bottom: 15px;
`

const Tweeps = styled.div`
  width: 31%;
  font-weight: bold;
  text-align: center;
`

const Following = styled.div`
  width: 33%;
  font-weight: bold;
  text-align: center;
`

const Followers = styled.div`
  width: 33%;
  font-weight: bold;
  text-align: center;
`

const Div = styled.div`
  color: #2185d0;
  font-size: 25px;
  padding-top: 5px;
`

export default class Profile extends Component {

  state = {
    user_details: [],
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
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    const { user_details } = this.state
    if (this.state.isAuth !== 'true') {
      return <Redirect to="/"/>
    }
    return (
      <Body>
        <Navbar {...this.props}/>
        <Container>
          <Profiler>
            <Details>
              <Picture><Image src={this.state.user_details.image_url} alt="pic"/></Picture>
              <Name>{user_details.firstname} {user_details.lastname}</Name>
              <Username>@{user_details.username}</Username>
              <Stats>
                <Tweeps>
                  <span>Tweeps</span>
                  <Div>{user_details.tweeps}</Div>
                </Tweeps>
                <Following>
                  <span>Following</span>
                  <Div>{user_details.following}</Div>
                </Following>
                <Followers>
                  <span>Followers</span>
                  <Div>{user_details.followers}</Div>
                </Followers>
              </Stats>
            </Details>
          </Profiler>
          <Feed>
            <Tweep>

            </Tweep>
          </Feed>
        </Container>
      </Body>
    )
  }
}
