import React, { Component } from 'react'
import { Button, Search, Icon } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
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

const searchStyle = {
  float: 'right',
  marginTop: '6px',
}

export default class Navbar extends Component {

  state = {
    user_id: localStorage.getItem('user_id'),
    username: '',
    isLoading: false,
    results: [],
    value: '',
    users: [],
  }

  componentDidMount() {
    this.getUser()
    this.getAllUsers()
  }

  getAllUsers = async () => {
    try {
      let res = await axios.get(`/api/user/all`)
      await this.asyncForEach(res.data, async item => {
        item.title = '@' + item.username
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

  render() {
    const { isLoading, value, results } = this.state
    return (
      <Container>
        <Wrapper>
          <Left>
            <Link><Nav to="/home"><Icon name='home'/>Home</Nav></Link>
            <Link><Nav to="/messages"><Icon name='envelope outline'/>Messages</Nav></Link>
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
      </Container>
    )
  }
  
}