import React, { Component } from 'react'
import { Button, Search, Icon, Modal, Input } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { animateScroll } from "react-scroll"
import _ from 'lodash'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  position: sticky;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: #2185d0;
  box-shadow: 0px 3px 3px grey;
  display: flex;
  flex-direction: row;
`

const Left = styled.div`
  width: 50%;
`

const Right = styled.div`
  width: 50%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 1200px
  margin: 0 auto;
`

const Link = styled.div`
  color: white;
  font-size: 17px;
  display: inline-block;
  margin-top: 15px;
  margin-right: 40px;
`

const Logout = styled(Button)`
  && {
    float: right;
    margin-top: 11px;
    margin-left: 20px;
  }
`

const Nav = styled(NavLink)`
  color: white;
  :hover {
    text-decoration: none;
    color: #d1d1d1;
  }
`

const StyledButton = styled.button`
  border: none;
  background-color: #2185d0;
  color: white;
  :hover {
    text-decoration: none;
    color: #d1d1d1;
    cursor: pointer;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 10px;
`

const Title = styled.h2`
  width: 50%;
`

const New = styled.div`
  width: 50%;
  text-align: right;
`

const Conversations = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 5px;
  padding-top: 5px;
  :hover {
    cursor: pointer;
    background-color: #e6ecf0;
  }
`
const ImageWrapper = styled.div`
  width: 65px;
`

const ConvoImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`

const Body = styled.div`
  width: 100%
  padding-left: 10px;
`

const ConvoName = styled.div`
  font-size: 20px;
  font-weight: bold;
`

const ConvoUser = styled.div`
  color: grey;
  padding-bottom: 5px;
`

const Chat = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 5px;
`

const Back = styled.div`
  width: 50px;
`

const ChatHeader = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  padding-bottom: 10px;
`

const ChatImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`

const IconButton = styled.button`
  border: none;
  background-color: white;
  :hover {
    cursor: pointer;
  }
`

const Other = styled.div`
  margin: 10px;
  padding: 10px;
`

const You = styled.div`
  margin: 10px;
  padding: 10px;
  text-align: right;
`

const OtherMessage = styled.span`
  border: 1px solid #E5E5EA;
  background-color: #E5E5EA;
  padding: 10px;
  border-radius: 10px;
`

const YouMessage = styled.span`
  border: 1px solid #0B93F6;
  background-color: #0B93F6;
  color: white;
  padding: 10px;
  border-radius: 10px;
`

const RoomContainer = styled.div`
  height: 65vh;
  overflow: auto;
`

const MessageWrapper = styled.div`
  margin-top: 15px;
  width: 100%;
`

const NewHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 10px;
`

const searchStyle = {
  float: 'right',
  marginTop: '6px',
}

export default class Navbar extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    local_username: localStorage.getItem('username'),
    username: '',
    isLoading: false,
    results: [],
    value: '',
    users: [],
    conversations: [],
    conversation: [],
    userchat: [],
    modaOpen: false,
    noResults: false,
    render: 'direct messages',
    message: '',
  }

  ws = new WebSocket('ws://localhost:8080');

  componentDidMount() {
    this.getUser()
    this.getAllUsers()
    this.ws.onopen = () => {
      console.log('connected')
    }
    this.ws.onclose = () => {
      console.log('disconnected')
    }
  }

  getAllUsers = async () => {
    try {
      let res = await axios.get(`/api/user/all`)
      await this.asyncForEach(res.data, async item => {
        item.title = item.username
      })
      this.setState({ users: res.data })
    }
    catch(err) { }
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  getUser = () => {
    axios.get(`/api/user/get/${this.state.user_id}`)
    .then(res => {
      this.setState({ username: res.data.username })
    })
    .catch(err => {
      console.log(err)
    })
  }

  logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('isAuth')
    this.props.history.push('/')
  }

  handleResultSelect = (e, { result }) => {
    this.props.history.push(`/${result.title}`)
    this.setState({ value: result.title })
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.users, isMatch),
      })
    }, 300)
  }

  search = e => {
    e.preventDefault()
    this.props.history.push(`/${this.state.value}`)
  }

  messages = () => {
    this.setState({ modalOpen: true, value: '' })
    this.getAllConversations()
  }

  getConversation = async user => {
    this.setState({ 
      render: 'chatroom',
      userchat: user,
    })
    let messages = await axios.get(`/api/message/receive/${user.user_id}`)
    this.setState({conversation: messages.data}, this.scrollToBottom())
  }

  scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "chat"
    })
  }
  getAllConversations = async () => {
    try {
      let temp = []
      let messages = await axios.get('/api/message/myMessages')
      if (messages.data.length === 0) {
        this.setState({ noResults: true })
      } else {
        await this.asyncForEach(messages.data, async item => {
          if (item.from_user_id === this.state.user_id) {
            let to_user = await axios.get(`/api/user/get/${item.to_user_id}`)
            to_user.data.firstname = to_user.data.firstname.charAt(0).toUpperCase() + to_user.data.firstname.slice(1)
            to_user.data.lastname = to_user.data.lastname.charAt(0).toUpperCase() + to_user.data.lastname.slice(1)
            temp.push(to_user.data)
          }
          if (item.to_user_id === this.state.user_id) {
            let from_user = await axios.get(`/api/user/get/${item.from_user_id}`)
            from_user.data.firstname = from_user.data.firstname.charAt(0).toUpperCase() + from_user.data.firstname.slice(1)
            from_user.data.lastname = from_user.data.lastname.charAt(0).toUpperCase() + from_user.data.lastname.slice(1)
            temp.push(from_user.data)
          }
        })
        this.setState({ conversations: temp })
      }
    }
    catch(err) { }
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  sendMessage = async e => {
    e.preventDefault()
    if (this.state.message.length !== 0) {
      await axios.post('/api/message/send', {
        message: this.state.message,
        to_userId: this.state.userchat.user_id
      })
      this.setState({ message: '' })
      this.getConversation(this.state.userchat)
    }
  }

  newMessage = async () => {
    this.setState({ render: 'new message' })
  }

  createConversation = async (e, { result }) => {
    e.preventDefault()
    if (this.state.local_username !== result.title) {
      try {
        let user = await axios.get(`/api/user/retrieve/${result.title}`)
        await axios.post('/api/message/new', {
          to_userId: user.data.user_id
        })
        this.getConversation(user.data)
        this.setState({ value: '' })
      }
      catch(err) { }
    } else {
      this.setState({ value: '' })
    }
  }

  createNew = async e => {
    e.preventDefault()
    if (this.state.local_username !== this.state.value) {
      try {
        let user = await axios.get(`/api/user/retrieve/${this.state.value}`)
        await axios.post('/api/message/new', {
          to_userId: user.data.user_id
        })
        this.getConversation(user.data)
        this.setState({ value: '' })
      }
      catch(err) {
        console.log(err)
        this.setState({ value: '' })
      }
    } else {
      this.setState({ value: '' })
    }
  }

  back = () => {
    this.setState({ render: 'direct messages', conversation: [], value: '' })
    this.getAllConversations()
  }

  getRender = () => {
    if (this.state.render === 'direct messages') {
      return (
        <>
          <Header>
            <Title>Direct Messages</Title>
            <New><Button color='twitter' onClick={this.newMessage} circular>New Message</Button></New>
          </Header>
          {this.state.conversations.map(item => (
            <Conversations key={item.user_id} onClick={() => {this.getConversation(item)}}>
              <ImageWrapper><ConvoImage src={item.image_url} alt="pic" /></ImageWrapper>
              <Body>
                <ConvoName>{item.firstname} {item.lastname}</ConvoName>
                <ConvoUser>@{item.username}</ConvoUser>
              </Body>
            </Conversations>
          ))}
        </>
      )
    }
    if (this.state.render === 'chatroom') {
      return (
        <>
          <Chat>
            <Back><IconButton onClick={this.back}><Icon name='arrow left' size='large' color='blue' /></IconButton></Back>
            <ChatHeader>
              <ImageWrapper><ChatImage src={this.state.userchat.image_url} alt="pic" /></ImageWrapper>
              <Body>
                <ConvoName>{this.state.userchat.firstname} {this.state.userchat.lastname}</ConvoName>
                <ConvoUser>@{this.state.userchat.username}</ConvoUser>
              </Body>
            </ChatHeader>
          </Chat>
          <RoomContainer id='chat'>
          {this.state.conversation.map(item => (
            <div key={item.message_id}>
              {this.state.user_id === item.owner_id ? (
                <You>
                  <YouMessage>{item.message}</YouMessage>
                </You>
              ) : (
                <Other>
                  <OtherMessage>{item.message}</OtherMessage>
                </Other>
              )}
            </div>
          ))}
          </RoomContainer>
          <MessageWrapper>
            <form onSubmit={this.sendMessage}>
              <Input icon={{ name: 'send', circular: true, link: true }} value={this.state.message} onChange={e => {this.setState({message: e.target.value})}} fluid/>
            </form>
          </MessageWrapper>
        </>
      )
    }
    if (this.state.render === 'new message') {
      return (
        <>
          <Chat>
            <Back><IconButton onClick={this.back}><Icon name='arrow left' size='large' color='blue' /></IconButton></Back>
            <ChatHeader><h2>New Message</h2></ChatHeader>
          </Chat>
          <NewHeader>Send message to:</NewHeader>
          <form onSubmit={this.createNew}>
            <Search 
              loading={this.state.isLoading}
              onResultSelect={this.createConversation}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
              })}
              results={this.state.results}
              value={this.state.value}
              input={{ fluid: true }}
            />
          </form>
        </>
      )
    }
  }

  render() {
    const { isLoading, value, results } = this.state
    return (
      <Container>
        <Wrapper>
          <Left>
            <Link><Nav to="/home"><Icon name='home'/>Home</Nav></Link>
            <Link><StyledButton onClick={this.messages}><Icon name='envelope outline'/>Messages</StyledButton></Link>
            <Link><Nav to={`/${this.state.username}`}><Icon name='address card outline'/>Profile</Nav></Link>
          </Left>
          <Right>
            <Logout size='mini' onClick={this.logout}>Logout</Logout>
            <form onSubmit={this.search}>
            <Search 
              style={searchStyle}
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
              })}
              results={results}
              value={value}
              fluid
            />
            </form>
          </Right>
        </Wrapper>
        <Modal 
          open={this.state.modalOpen}
          onClose={() => {
            this.setState({ modalOpen: false })
          }}
          centered={false} 
          size='small'
          closeIcon
          style={{height: '85vh'}}
        >
          <Modal.Content>
            {this.getRender()}
          </Modal.Content>
        </Modal>
      </Container>
    )
  }
  
}