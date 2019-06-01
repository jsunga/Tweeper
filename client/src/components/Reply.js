import React, { Component } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

export default class Reply extends Component {

  state = {
    isOpen: false,
    tweep_id: ''
  }

  componentDidMount() {
    let id = this.props.location.pathname.split('/')
    if (id[3] !== undefined) {
      this.setState({ tweep_id: id[3], isOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ modalOpen: false })
    this.props.history.replace(`/${this.props.match.params.username}`)
  }

  render() {
    return (
      <>
        <Modal open={false}>
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>We've found the following gravatar image associated with your e-mail address.</p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </>
    )
  }

}
