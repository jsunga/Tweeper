import React, { Component } from 'react'
import Navbar from './Navbar'
import List from './List'
import axios from 'axios'

export default class Following extends Component {

  componentDidMount() {
    const { handle } = this.props.match.params
    this.getFollowing(handle)
  }

  getFollowing = handle => {
    axios.get(`/api/user/retrieve/${handle}`)
    .then(res => {
      axios.get(`/api/follow/get_following/${res.data.user_id}`)
      .then(res => {
        console.log(res.data)
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        <Navbar/>
        <List/>
      </div>
    )
  }
}
