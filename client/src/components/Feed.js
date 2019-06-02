import React, { Component } from 'react'
import { Button, Icon, Loader } from 'semantic-ui-react'
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 5px;
  padding-top: 7px;
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

const Username = styled.div`
  color: grey;
  padding-bottom: 5px;
`

const Re = styled.div`
  color: grey;
  padding-bottom: 3px;
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

const StyledButton = styled.button`
  border: none;
  background-color: white;
  :hover {
    cursor: pointer
  }
`

export default class Feed extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    tweep: '',
    tweeps: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getTweeps()
  }

  getTweeps = async () => {
    let temp = []
    let followers = await axios.get(`/api/follow/get_following/${this.state.user_id}`)
    await this.asyncForEach(followers.data, async item => {
      try {
        let tweeps = await axios.get(`/api/tweep/get/${item.following_user_id}`)
        await this.asyncForEach(tweeps.data, async item => {
          let details = await axios.get(`/api/user/get/${item.user_id}`)
          item.image_url = details.data.image_url
          item.username = details.data.username
          temp.push(item)
        })
      }
      catch(err) { }
      try {
        let retweeps = await axios.get(`/api/retweep/get/${item.following_user_id}`)
        await this.asyncForEach(retweeps.data, async item => {
          let retweeper_details = await axios.get(`/api/user/get/${item.user_id}`)
          let response = await axios.get(`/api/tweep/retrieve/${item.tweep_id}`)
          let original_details = await axios.get(`/api/user/get/${response.data.user_id}`)
          response.data.retweeper_username = retweeper_details.data.username
          response.data.date_created = item.date_created
          response.data.username = original_details.data.username
          response.data.image_url = original_details.data.image_url
          temp.push(response.data)
        })
      }
      catch(err) { }
    })
    temp.sort((a, b) => {
      a = new Date(a.date_created);
      b = new Date(b.date_created);
      return a > b ? -1 : a < b ? 1 : 0
    })
    await this.asyncForEach(temp, async item => {
      item.date_created = new Date(item.date_created).toDateString()
    })
    this.setState({ tweeps: this.getUnique(temp, 'tweep_id'), isLoading: false })
  }

  getUnique = (arr, comp) => {
    const unique = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e]).map(e => arr[e]);
    return unique;
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
        console.log(err)
      })
    }
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  getRender = () => {
    if (this.state.isLoading === true) {
      return <Loader style={{marginTop: '20px'}} active inline='centered' />
    }
    return (
      <>
        {this.state.tweeps.map(item => (
          <Wrapper key={item.tweep_id}>
            <ImageWrapper><Image src={item.image_url} alt="pic"/></ImageWrapper>
            <Body>
              {item.retweeper_username ? (
                <Re>{item.retweeper_username} Retweeped</Re>
              ) : (
                null
              )}
              <Username>@{item.username} {item.date_created}</Username>
              <div>{item.content}</div>
              <Totals>
                <Bottom><StyledButton onClick={() => {this.handleOpen(item.tweep_id)}}><Icon name='reply' color='blue' size='large'/>{item.total_replies}</StyledButton></Bottom>
                <Bottom><StyledButton onClick={() => {this.retweep(item.tweep_id)}}><Icon name='retweet' color='green' size='large'/> {item.total_retweeps}</StyledButton></Bottom>
                <Bottom><StyledButton onClick={() => {this.like(item.tweep_id)}}><Icon name='like' color='red' size='large'/> {item.total_likes}</StyledButton></Bottom>
              </Totals>
            </Body>
          </Wrapper>
        ))}
      </>
    )
  }

  render() {
    return (
      <Container>
        <TextWrapper><TextArea placeholder={`What's happening?`} value={this.state.tweep} onChange={e => {this.setState({ tweep: e.target.value })}}/></TextWrapper>
        <Button onClick={this.tweep} color='twitter' fluid>Tweep</Button>
        {this.getRender()}
      </Container>
    )
  }

}
