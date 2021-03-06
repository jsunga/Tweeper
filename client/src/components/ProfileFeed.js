import React, { Component } from 'react'
import { Button, Message, Icon, Loader, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Reply from './Reply'
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

const TextArea = styled.textarea`
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

export default class ProfileFeed extends Component {

  state = {
    local_user: localStorage.getItem('username'),
    local_user_id: localStorage.getItem('user_id'),
    profile_details: [],
    tweeps: [],
    replies: [],
    tweep: [],
    tweep_id: '',
    message: '',
    noResults: false,
    isLoading: true,
    isFollowing: false,
    modalOpen: false,
  }

  componentDidMount() {
    this.getFollowing(this.props.match.params.handle)
    this.getDetails(this.props.match.params.handle)
  }

  //open the modal
  handleOpen = async value => {
    this.getReplies(value)
  }

  // 1) open the replies modal
  // 2) get tweep and owner details
  // 3) get all the replies of the tweep with user details
  getReplies = async value => {
    this.setState({ modalOpen: true })

    let tweep = await axios.get(`/api/tweep/retrieve/${value}`)
    window.history.pushState(null, null, `/${tweep.data.username}/status/${value}`)
    this.setState({ tweep: tweep.data })

    let replies = await axios.get(`/api/reply/get/${value}`)
    this.setState({ replies: replies.data })
  }

  getFollowing = handle => {
    axios.get(`/api/follow/get_following/${this.state.local_user_id}`)
    .then(res => {
      res.data.forEach(item => {
        axios.get(`/api/user/get/${item.following_user_id}`)
        .then(res => {
          if (handle === res.data.username) {
            this.setState({ isFollowing: true })
          }
        })
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  getDetails = async handle => {
    try {
      let user = await axios.get(`/api/user/retrieve/${handle}`)
      this.setState({ profile_details: user.data })

      try {
        let profile = await axios.get(`/api/tweep/get/profile/${handle}`)

        if (profile.data === 'No data returned from the query.') {
          this.setState({ isLoading: false })
        } else {
          this.setState({ tweeps: profile.data, isLoading: false })
        }
      }
      catch(err) {
        console.log(err)
      }
    }
    catch(err) {
      if (err.response.status === 404) {
        this.setState({ noResults: true, isLoading: false })
      }
    }
  }

  //async forEach method
  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  getFollowRender = () => {
    console.log(this.state.following)
    console.log(this.props.match.params.handle)
    this.state.following.forEach(item => {
      if (item === this.props.match.params.handle) {
        return <Button color='twitter' fluid>Follow</Button>
      }
    })
  }

  unfollow = () => {
    axios.delete(`/api/follow/delete/${this.state.profile_details.user_id}`)
    .then(() => {
      this.setState({ isFollowing: false })
    })
    .catch(err => {
      console.log(err)
    })
  }

  follow = () => {
    axios.post(`/api/follow`, {
      following_userId: this.state.profile_details.user_id
    })
    .then(() => {
      this.setState({ isFollowing: true })
    })
    .catch(err => {
      console.log(err)
    })
  }

  like = value => {
    axios.get(`/api/like/check/${value}`)
    .then(res => {
      if (res.data === 'like') {
        axios.post('/api/like', { tweepId: value })
        .then(() => {
          this.getDetails(this.props.match.params.handle)
        })
      }
      if (res.data === 'unlike') {
        axios.delete(`/api/like/unlike/${value}`)
        .then(() => {
          this.getDetails(this.props.match.params.handle)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  retweep = value => {
    axios.get(`/api/retweep/check/${value}`)
    .then(res => {
      if (res.data === 'retweep') {
        axios.post('/api/retweep', { tweepId: value })
        .then(() => {
          this.getDetails(this.props.match.params.handle)
        })
      }
      if (res.data === 'undo retweep') {
        axios.delete(`/api/retweep/undo/${value}`)
        .then(() => {
          this.getDetails(this.props.match.params.handle)
        })
      }
    })
    .catch(err => {
      console.log(err)
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

  //handle follow button where user is @ local profile, following user, or not following user
  getFollowButton = () => {
    if (this.props.match.params.handle === this.state.local_user) {
      return null
    }
    if (this.state.isFollowing === true) {
      return (
        <Button animated='vertical' style={{marginBottom: '5px'}} color='twitter' fluid onClick={this.unfollow}> 
          <Button.Content hidden>Unfollow</Button.Content>
          <Button.Content visible>Following</Button.Content>
        </Button>
      )
    }
    if (this.state.isFollowing === false) {
      return <Button style={{marginBottom: '5px'}} color='twitter' fluid onClick={this.follow}>Follow</Button>
    }
  }

  render() {
    const { isLoading, noResults, tweeps, modalOpen, tweep, message, replies } = this.state
    if (isLoading === true) {
      return <Loader style={{marginTop: '75px'}} active inline='centered' />
    }
    return (
      <Container>
        {this.getFollowButton()}
        {noResults ? (
          <Message><Message.Header>No Tweeps :(</Message.Header></Message>
        ) : (
          <>
            <Title>Tweeps</Title>
            {tweeps.map(item => (
              <Wrapper key={item.tweep_id}>
                <ImageWrapper><Image src={item.image_url} alt="pic"/></ImageWrapper>
                <Body>
                  {item.username === this.props.match.params.handle ? (
                    null
                  ) : (
                    <Re>{this.props.match.params.handle} Retweeped</Re>
                  )}
                  <Username><Link to={`/${item.username}`}>@{item.username}</Link> {item.date_created}</Username>
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
        )}
        <Modal 
          open={modalOpen}
          onClose={() => {
            this.props.history.push(`/${this.state.profile_details.username}`)
            this.setState({ modalOpen: false, tweeper: [], tweep: [], replies: [] })
            this.getDetails(this.state.profile_details.username)
          }}
          centered={false} 
          size='small'
          closeIcon
        >
          <Modal.Content>
            <ModalHeader>
              <ModalImage src={tweep.image_url} alt="pic"/>
              <ModalDetails>
                <ModalName>{tweep.firstname} {tweep.lastname}</ModalName>
                <ModalUser><Link to={`/${tweep.username}`}>@{tweep.username}</Link></ModalUser>
              </ModalDetails>
            </ModalHeader>
            <Content>{tweep.content}</Content>
            <Created>{tweep.date_created}</Created>
            <TextArea placeholder="Tweep your reply" value={message} onChange={e => {this.setState({ message: e.target.value })}}/>
            <Button style={{marginBottom: '5px'}} onClick={this.reply} color='twitter' fluid>Reply</Button>
            {replies.map(item => (
              <Replies key={item.content}>
                <ReplyHeader>
                  <ReplyImage src={item.image_url} alt="pic" />
                  <ReplyWrapper>
                    <ReplyName><Link to={`/${item.username}`}>@{item.username}</Link></ReplyName>
                    <ReplyContent>{item.content}</ReplyContent>
                    <Created>{item.date_created}</Created>
                  </ReplyWrapper>
                </ReplyHeader>
              </Replies>
            ))}
          </Modal.Content>
        </Modal>
        <Reply {...this.props} {...this.state} getReplies={this.getReplies}/>
      </Container>
    )
  }
  
}