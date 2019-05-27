import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: white;
  margin-right: 10px;
`

const Image = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`

const ProfileImage = styled.div`
  padding-top: 10px;
  text-align: center;
`

const Name = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-left: 14px;
`

const Username = styled.div`
  padding-left: 12px;
  padding-top: 5px;
`

const Totals = styled.div`
  margin-top: 10px;
  width: 290px;
  display: flex;
  flex-direction: row;
  padding-bottom: 15px;
`

const Tweeps = styled.div`
  width: 31%;
  font-weight: bold;
  text-align: center;
`

const Following = styled.div`
  width: 33%;
  font-weight: bold;
  text-align: center;
`

const Followers = styled.div`
  width: 33%;
  font-weight: bold;
  text-align: center;
`

const Wrapper = styled.div`
  color: #2185d0;
  font-size: 25px;
  padding-top: 5px;
`

const Summary = props => {

  return (
    <Container>
      <ProfileImage><Image src={props.user_details.image_url} alt="pic"/></ProfileImage>
      <Name>{props.user_details.firstname} {props.user_details.lastname}</Name>
      <Username>@{props.user_details.username}</Username>
      <Totals>
        <Tweeps>
          <span>Tweeps</span>
          <Wrapper>{props.user_details.tweeps}</Wrapper>
        </Tweeps>
        <Following>
          <span>Following</span>
          <Wrapper>{props.user_details.following}</Wrapper>
        </Following>
        <Followers>
          <span>Followers</span>
          <Wrapper>{props.user_details.followers}</Wrapper>
        </Followers>
      </Totals>
    </Container>
  )
  
}

export default Summary