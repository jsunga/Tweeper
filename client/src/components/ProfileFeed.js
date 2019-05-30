import React, { Component } from 'react'
import { Button, Message, Icon, Loader } from 'semantic-ui-react'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  width: 570px;
  margin: 0 auto;
  margin-top: 10px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 5px;
  padding-top: 5px;
`

const ImageWrapper = styled.div`
  width: 65px;
`

const Body = styled.div`
  width: 100%
  padding-left: 10px;
`

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`

const Re = styled.div`
  color: grey;
  font-size: 12px;
`

const Username = styled.div`
  color: grey;
  padding-bottom: 5px;
`

const Totals = styled.div`
  display: flex;
  flex-direction: row
`

const Bottom = styled.div`
  padding-top: 10px;
  width: 100px;
  font-weight: bold
`

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #d6d6d6;
`

export default class ProfileFeed extends Component {

  state = {
    local_user: localStorage.getItem('username'),
    local_user_id: localStorage.getItem('user_id'),
    local_details: [],
    user_id: '',
    tweeps: [],
    noResults: false,
    isLoading: true,
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
      this.setState({ local_details: user.data })
      user_id = user.data.user_id
      let tweeps = await axios.get(`/api/tweep/get/${user_id}`)
      await this.asyncForEach(tweeps.data, async item => {
        item.username = user.data.username
        item.image_url = user.data.image_url
      })
      temp = tweeps.data
      try {
        let retweeps = await axios.get(`/api/retweep/get/${user_id}`)
        await this.asyncForEach(retweeps.data, async item => {
          let response = await axios.get(`/api/tweep/retrieve/${item.tweep_id}`)
          let details = await axios.get(`/api/user/get/${response.data.user_id}`)
          response.data.username = details.data.username
          response.data.image_url = details.data.image_url
          temp.push(response.data)
        })
      }
      catch(err) {
        console.log(err)
      }
      temp.sort((a, b) => {
        a = new Date(a.date_created);
        b = new Date(b.date_created);
        return a > b ? -1 : a < b ? 1 : 0
      })
      await this.asyncForEach(temp, async item => {
        item.date_created = new Date(item.date_created).toDateString()
      })
      this.setState({ tweeps: temp, isLoading: false })
    }
    catch(err) {
      if (err.response.status === 404) {
        this.setState({ noResults: true })
      }
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
    if (this.state.isLoading === true) {
      return <Loader style={{marginTop: '75px'}}active inline='centered' />
    }
    return (
      <Container>
        {this.getFollowRender()}
        {this.state.noResults ? (
          <Message><Message.Header>No Tweeps :(</Message.Header></Message>
        ) : (
          <>
            <Title>Tweeps</Title>
            {this.state.tweeps.map(item => (
              <Wrapper key={item.tweep_id}>
                <ImageWrapper><Image src={item.image_url} alt="pic"/></ImageWrapper>
                <Body>
                  {item.username === this.props.match.params.handle ? (
                    null
                  ) : (
                    <Re>You Retweeped</Re>
                  )}
                  <Username>@{item.username} {item.date_created}</Username>
                  <div>{item.content}</div>
                  <Totals>
                    <Bottom><Icon name='reply' size='large'/>{item.total_replies}</Bottom>
                    <Bottom><Icon name='retweet' size='large'/> {item.total_retweeps}</Bottom>
                    <Bottom><Icon name='like' size='large'/> {item.total_likes}</Bottom>
                  </Totals>
                </Body>
              </Wrapper>
            ))}
          </>
        )}
      </Container>
    )
  }
  
}