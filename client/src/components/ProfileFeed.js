import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 570px;
  margin: 0 auto;
  margin-top: 5px;
`

export default class ProfileFeed extends Component {

  state = {
    local_user: localStorage.getItem('username'),
    user_id: '',
    tweeps: [],
  }

  componentDidMount() {
    const { handle } =  this.props.match.params
    this.getDetails(handle)
  }

  getDetails = handle => {
    axios.get(`/api/user/retrieve/${handle}`)
    .then(res => {
      this.setState({ user_id: res.data.user_id })
      axios.get(`/api/tweep/get/${res.data.user_id}`)
      .then(res => {
        res.data.reverse()
        this.setState({ tweeps: res.data })
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  getFollowRender = () => {
    if (this.state.local_user !== this.props.match.params.handle) {
      return <Button color='twitter' fluid>Follow</Button>
    }
  }

  render() {

    return (
      <Container>
        {this.getFollowRender()}
      </Container>
    )

  }
}
