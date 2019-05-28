import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 570px;
  margin: 0 auto;
`

const TextWrapper = styled.div`
  text-align: center;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 70px;
  resize: none;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  margin-top: 15px;
  margin-bottom: 5px;
`

export default class Feed extends Component {

  state = {
    tweep: ''
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

    return (
      <Container>
        <TextWrapper><TextArea placeholder={`What's happening?`} value={this.state.tweep} onChange={e => {this.setState({ tweep: e.target.value })}}/></TextWrapper>
        <Button onClick={this.tweep} color='twitter' fluid>Tweep</Button>
      </Container>
    )

  }
}
