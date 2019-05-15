import React, { Component } from 'react'
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';
import firebase from '../../firebase'

class Channels extends Component {
    state={
        // user: this.props,
        channels: [],
        modal: false,
        nameChannel: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels')
    }

    componentDidMount(){
        this.addListeners()
    }

    addListeners = () => {
        let loadedChannels =[];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({channels: loadedChannels})
            // console.log(loadedChannels)
        })
    }

    closeModal = () => this.setState({modal: false})
    
    openModal = () => this.setState({modal: true})
    

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    addChannel = () => {
        const {channelsRef, nameChannel, channelDetails} =this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: nameChannel,
            details: channelDetails,
            createdBy: {
                name: this.props.currUser.currUser.displayName,
                avatar: this.props.currUser.currUser.photoURL
            }
        }
        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({nameChannel: '', channelDetails: ''})
            this.closeModal()
            console.log('channel added')
        })
        .catch(err => {
            console.error(err)
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.isFormValid(this.state)){
            this.addChannel()
        }
    }

    isFormValid = ({nameChannel, channelDetails}) => nameChannel && channelDetails

  render() {
   let displayChannels = this.state.channels.map(channel => {
            console.log(channel.name)
            return (
                <Menu.Item
                    key={channel.id}
                    onClick={() => console.log(channel)}
                    name={channel.name}
                    style={{opacity: 0.7}}
                    >
                    # {channel.name}
                    </Menu.Item>  
            ) 
    })
      const {channels} = this.state
    return (
 <React.Fragment>
      <Menu.Menu style={{paddingBottom:'2em'}}>
        <Menu.Item>
            <span>
                <Icon name='exchange'/> Channels
            </span>{' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal}/>
        </Menu.Item>

        {displayChannels}
        {/* {this.displayChannels} */}
      </Menu.Menu>
      <Modal basic open={this.state.modal} onClose={this.closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                    <Input
                        fluid
                        label='Name of channel'
                        name='nameChannel'
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Input
                        fluid
                        label='About the channel'
                        name='channelDetails'
                        onChange={this.handleChange}
                    />
                </Form.Field>
            </Form>
        </Modal.Content>

        <Modal.Actions>
            <Button color='green' inverted onClick={this.handleSubmit}>
                <Icon name='checkmark'/> Add
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
                <Icon name='remove'/> Cancel
            </Button>
        </Modal.Actions>   
      </Modal>
 </React.Fragment>
    )
  }
}

export default Channels
