import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Navbar from './Navbar'

export default class Home extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    isAuth: localStorage.getItem('isAuth'),
  }

  render() {
    if (this.state.isAuth !== 'true') {
      return <Redirect to="/"/>
    }
    return (
      <>
        <Navbar {...this.props}/>
      </>
    )
  }
}