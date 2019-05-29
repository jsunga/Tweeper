import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div`
  width: 215px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
  background-color: white;
`

const Image = styled.img`
  width: 215px;
  height: 150px;
`

const Header = styled.div`
  color: black;
  font-weight: bold;
  font-size: 17px;
  padding-left: 10px;
  padding-top: 5px;
`

const Username = styled.div`
  color: grey;
  padding-left: 10px;
  padding-bottom: 10px;
`

const List = props => {
  return (
    <>
      {props.users.map(item => (
        <Link to={`/user/${item.username}`} key={item.user_id}>
        <Card>
          <Image src={item.image_url} alt="thumbnail"/>
          <div>
            <Header>{item.firstname} {item.lastname}</Header>
            <Username>@{item.username}</Username>
          </div>
        </Card>
        </Link>
      ))}
    </>
  )
}

export default withRouter(List)