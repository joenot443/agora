import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      muted: [],
      handRaised: [],
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
        messages.push({ member, text: data.msg });
        this.setState({ messages });
      });
    });
  }

  render() {
    return (
      <div className={s.root}>
        <ToastContainer
          newestOnTop
          autoClose={5000}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <Members
          membersCount={this.state.members.length}
          members={this.state.members}
          currentMember={this.state.member}
          hands={this.state.handRaised}
        />
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
          onMemberMuted={this.onMemberMuted}
          mutedList={this.state.muted}
        />
        <Input
          onSendMessage={this.onSendMessage}
          username={this.state.member.username}
          onHandRaise={this.onHandRaise}
        />
        />
      </div>
    );
  }
  // What happens upon pressing 'send'
  // This gets passed as a prop to the Input component
  onSendMessage = (message, username) => {
    if (!this.state.muted.includes(username)) {
      this.drone.publish({
        room: 'observable-room',
        message: { msg: message },
      });
    }
  };

  onHandRaise = username => {
    if (this.state.handRaised.includes(username)) {
      console.log('true');
      console.log(this.state.handRaised);
      const index = this.state.handRaised.indexOf(username);
      const arr = [...this.state.handRaised];
      arr.splice(index, 1);
      this.setState({
        handRaised: arr,
      });
    } else {
      this.setState({
        handRaised: [...this.state.handRaised, username],
      });
      toast.info(`${username} has raised their hand`, {
        position: 'top-left',
        autoClose: true,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  onMemberMuted = username => {
    this.setState({
      muted: [...this.state.muted, username],
    });
  };
}

export default withStyles(s)(Chatroom);
