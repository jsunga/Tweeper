import React, { Component } from 'react'
import { Button, Icon, Loader, Modal } from 'semantic-ui-react'
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

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
`

const ModalImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`

const ModalDetails = styled.div`
  padding-left: 10px;
`

const ModalName = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const ModalUser = styled.div`
  color: grey;
`

const Content = styled.div`
  padding-top: 5px;
  font-size: 30px;
`

const Text = styled.textarea`
  width: 100%;
  height: 60px;
  resize: none;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  margin-top: 15px;
  margin-bottom: 5px;
`

const Replies = styled.div`
  border-top: 1px solid #d6d6d6;
  padding-top: 10px;
  padding-bottom: 10px;
`

const ReplyHeader = styled.div`
  display: flex;
  flex-direction: row;
`

const ReplyImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const ReplyName = styled.div`
  color: grey;
`

const Created = styled.div`
  padding-top: 5px;
  color: grey
`

const ReplyWrapper = styled.div`
  padding-left: 7px;
`

const ReplyContent = styled.div`
  padding-top: 7px;
  font-size: 20px;
`

export default class Feed extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    tweep_msg: '',
    tweeps: [],
    replies: [],
    tweep: [],
    tweeper: [],
    message: '',
    isLoading: true,
    modalOpen: false,
  }

  componentDidMount() {
    this.getTweeps()
  }

  handleOpen = async value => {
    this.getReplies(value)
  }

  getReplies = async value => {
    this.setState({ modalOpen: true })
    let tweep = await axios.get(`/api/tweep/retrieve/${value}`)
    tweep.data.date_created = new Date(tweep.data.date_created).toDateString()
    let tweeper_user = await axios.get(`/api/user/get/${tweep.data.user_id}`)
    window.history.pushState(null, null, `/${tweeper_user.data.username}/status/${value}`)
    let data = tweeper_user.data
    data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
    data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
    this.setState({ tweep: tweep.data, tweeper: data })
    let users = await axios.get(`/api/reply/get/${value}`)
    await this.asyncForEach(users.data, async item => {
      let details = await axios.get(`/api/user/get/${item.replier_user_id}`)
      item.image_url = details.data.image_url
      item.username = details.data.username
      item.date_created = new Date(item.date_created).toDateString()
    })
    this.setState({ replies: users.data })
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
        this.setState({ tweep_msg: '' })
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

  like = value => {
    axios.post(`/api/like`, {
      tweepId: value
    })
    .then(() => {
      this.getTweeps()
    })
    .catch(err => {
      if (err.response.status === 400) {
        axios.delete(`/api/like/unlike/${value}`)
        .then(() => {
          this.getTweeps()
        })
      }
      console.log(err.response.status)
    })
  }

  retweep = value => {
    axios.post(`/api/retweep`, {
      tweepId: value
    })
    .then(() => {
      this.getTweeps()
    })
    .catch(err => {
      if (err.response.status === 400) {
        axios.delete(`/api/retweep/undo/${value}`)
        .then(() => {
          this.getTweeps()
        })
        .catch(err => {
          console.log(err.response.status)
        }) 
      }
    })
  }

  reply = () => {
    if (this.state.message.length === 0) {
      alert('No empty reply')
    } else {
      axios.post(`/api/reply`, {
        tweepId: this.state.tweep.tweep_id,
        content: this.state.message
      })
      .then(() => {
        this.setState({ message: '' })
        this.getReplies(this.state.tweep.tweep_id)
      })
      .catch(err => {
        console.log(err)
      })
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
    const { modalOpen, tweeper, tweep, message, replies } = this.state
    return (
      <Container>
        <TextWrapper><TextArea placeholder={`What's happening?`} value={this.state.tweep_msg} onChange={e => {this.setState({ tweep_msg: e.target.value })}}/></TextWrapper>
        <Button onClick={this.tweep} color='twitter' fluid>Tweep</Button>
        {this.getRender()}
        <Modal 
          open={modalOpen}
          onClose={() => {
            this.props.history.push('/home')
            this.setState({ modalOpen: false, tweeper: [], tweep: [], replies: [] })
          }}
          centered={false} 
          size='small'
        >
          <Modal.Content>
            <ModalHeader>
              <ModalImage src={tweeper.image_url} alt="pic"/>
              <ModalDetails>
                <ModalName>{tweeper.firstname} {tweeper.lastname}</ModalName>
                <ModalUser>@{tweeper.username}</ModalUser>
              </ModalDetails>
            </ModalHeader>
            <Content>{tweep.content}</Content>
            <Created>{tweep.date_created}</Created>
            <Text placeholder="Tweep your reply" value={message} onChange={e => {this.setState({ message: e.target.value })}}/>
            <Button style={{marginBottom: '5px'}} onClick={this.reply} color='twitter' fluid>Reply</Button>
            {replies.map(item => (
              <Replies key={item.content}>
                <ReplyHeader>
                  <ReplyImage src={item.image_url} alt="pic" />
                  <ReplyWrapper>
                    <ReplyName>@{item.username}</ReplyName>
                    <ReplyContent>{item.content}</ReplyContent>
                    <Created>{item.date_created}</Created>
                  </ReplyWrapper>
                </ReplyHeader>
              </Replies>
            ))}
          </Modal.Content>
        </Modal>
      </Container>
    )
  }

}
