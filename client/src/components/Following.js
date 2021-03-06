import React, { Component } from 'react'
import { Placeholder, Message } from 'semantic-ui-react'
import Navbar from './Navbar'
import Summary from './Summary'
import ErrorComponent from './ErrorComponent'
import List from './List'
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

const PlaceholderWrapper = styled.div`
  background-color: white;
  margin-right: 10px;
  height: 205px;
  padding: 15px;
`

const ListWrapper = styled.div`
  width: 905px;
  margin-top: 15px;
  overflow: auto;
`

export default class Following extends Component {

  state = {
    user_details: [],
    users: [],
    isLoading: true,
    noResults: false,
    error: false,
  }

  componentDidMount() {
    const { handle } = this.props.match.params
    this.getFollowing(handle)
  }

  getFollowing = handle => {
    axios.get(`/api/user/retrieve/${handle}`)
    .then(res => {
      let data = res.data
      data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
      data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
      this.setState({ user_details: res.data, isLoading: false })
      axios.get(`/api/follow/get_following/${res.data.user_id}`)
      .then(res => {
        if (res.data.length === 0) {
          this.setState({ noResults: true })
        } else {
          let temp = []
          res.data.forEach(item => {
            axios.get(`/api/user/get/${item.following_user_id}`)
            .then(res => {
              let data = res.data
              data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
              data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
              temp.push(data)
              this.setState({ users: temp })
            })
          })
        }
      })
    })
    .catch(err => {
      if (err.response.status === 404) {
        this.setState({ error: true })
      }
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
        <Summary {...this.state}/>
      )
    }
  }

  render() {
    if (this.state.error === true) {
      return (
        <>
          <Navbar {...this.props}/>
          <ErrorComponent/>
        </>
      )
    }
    return (
      <>
        <style>{'body { background-color: #e6ecf0; }'}</style>
        <Navbar {...this.props}/>
        <Container>
          <ProfileWrapper>{this.getRender()}</ProfileWrapper>
          <ListWrapper>
            {this.state.noResults ? (
              <Message><Message.Header>Following None :(</Message.Header></Message>
            ) : (
              <List {...this.state}/>
            )}
          </ListWrapper>
        </Container>
      </>
    )
  }
  
}