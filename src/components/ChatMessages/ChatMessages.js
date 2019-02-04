import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Chatroom/Chatroom.css';

class Messages extends Component {
  // Element used to enable auto-scrolling
  msgsBottom = React.createRef();

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  // Scrolls to msgsBottom element
  scrollToBottom() {
    this.msgsBottom.current.scrollIntoView({ behavior: 'smooth' });
  }

  // Renders the list of messages
  render() {
    const { messages } = this.props;
    return (
      <ul className={s['Messages-list']}>
        {messages.map(m => this.renderMessage(m))}
        <div ref={this.msgsBottom} />
      </ul>
    );
  }

  // Renders a single message object and returns formatted message to display
  renderMessage(message) {
    const { member, text } = message;
    const { currentMember } = this.props;
    const messageFromMe = member.id === currentMember.id;
    const className = messageFromMe
      ? 'Messages-message currentMember'
      : 'Messages-message';
    return (
      <li className={s[className]}>
        <span
          className={s.avatar}
          style={{ backgroundColor: member.clientData.color }}
        />
        <div className={s['Message-content']}>
          <div className={s.username}>{member.clientData.username}</div>
          <div className={s.text}>{text}</div>
        </div>
      </li>
    );
  }
}

export default withStyles(s)(Messages);
