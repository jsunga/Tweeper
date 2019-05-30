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

  getDetails = async handle => {
    try {
      let user_id = ''
      let temp = []
      let user = await axios.get(`/api/user/retrieve/${handle}`)
      user_id = user.data.user_id
      let tweeps = await axios.get(`/api/tweep/get/${user_id}`)
      temp = tweeps.data
      let retweeps = await axios.get(`/api/retweep/get/${user_id}`)
      await this.asyncForEach(retweeps.data, async item => {
        let response = await axios.get(`/api/tweep/retrieve/${item.tweep_id}`)
        temp.push(response.data)
      })
      temp.sort((a, b) => {
        return a.time_created - b.time_created
      })
      temp.reverse()
      console.log(temp)
      this.setState({ tweeps: temp })
    }
    catch(err) {
      console.log(err)
    }
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
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