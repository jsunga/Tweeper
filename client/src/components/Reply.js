import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'

export default class Reply extends Component {

  state = {
    modalOpen: false,
    tweep_id: '',
    tweeper: [],
    tweep: [],
    replies: [],
  }

  componentDidMount() {
    let id = this.props.location.pathname.split('/')
    if (id[3] !== undefined) {
      this.props.getReplies(id[3])
    }
  }

  render() {
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={() => {
          this.props.history.push(`/${this.props.profile_details.username}`)
          this.setState({ modalOpen: false })
          this.getDetails(this.props.profile_details.username)
        }}
        centered={false}
        size='small'
      >
        <Modal.Content></Modal.Content>
      </Modal>
    )
  }

}
