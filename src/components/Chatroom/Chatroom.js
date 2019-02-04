import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Messages from '../ChatMessages/ChatMessages';
import Members from '../ChatMembers/ChatMembers';
import Input from '../ChatInput/ChatInput';
import s from '../Chatroom/Chatroom.css';

const CHANNEL_ID = '2nRjKbOw2T5K0453';

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}

class Chatroom extends Component {
  static propTypes = {
    username: PropTypes.string,
  };
  static defaultProps = {
    username: `student_${Math.floor(Math.random() * Math.floor(100))}`,
  };

  constructor(props) {
    super(props);
    this.state = {
      members: [],
      messages: [],
      member: {
        username: props.username,
        color: randomColor(),
      },
    };

    // New Drone object - requires a member object under data
    this.drone = new window.Scaledrone(CHANNEL_ID, {
      data: this.state.member,
    });

    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }

      // observable-room allows for "who's online feature"
      const room = this.drone.subscribe('observable-room');

      room.on('open', error => {
        if (error) {
          return console.error(error);
        }
        // Give current member a unique ID
        const member = { ...this.state.member };
        member.id = this.drone.clientId;
        this.setState({ member });
      });

      // Called upon loading the chatroom for the first time
      room.on('members', m => {
        this.setState({ members: m });
      });

      // Called when a member joins the chatroom -- updates members list
      room.on('member_join', member => {
        console.log(`Member joined: ${member.clientData.username}`);
        const members = this.state.members;
        members.push({ member });
        this.setState({ members });
      });

      // Called when a member leaves the chatroom -- updates members list
      room.on('member_leave', ({ id }) => {
        const index = this.state.members.findIndex(member => member.id === id);
        const members = this.state.members;
        members.splice(index, 1);
        this.setState({ members });
      });

      // Called upon data being published to the room -- updates messages list
      room.on('data', (data, member) => {
        const messages = this.state.messages;
        messages.push({ member, text: data });
        this.setState({ messages });
      });
    });
  }

  render() {
    return (
      <div className={s.root}>
        <Members
          membersCount={this.state.members.length}
          members={this.state.members}
          currentMember={this.state.member}
        />
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }
  // What happens upon pressing 'send'
  // This gets passed as a prop to the Input component
  onSendMessage = message => {
    this.drone.publish({
      room: 'observable-room',
      message,
    });
  };
}

export default withStyles(s)(Chatroom);
