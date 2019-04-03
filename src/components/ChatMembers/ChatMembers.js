import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Chatroom/Chatroom.css';

class Members extends Component {
  render() {
    const { membersCount, members } = this.props;
    // Renders the list of members currently online
    return (
      <div className={s['members-count']}>
        <p>{membersCount} member(s) are currently in the chatroom.</p>
        <details>
          <summary>
            <b>Members Online</b>
          </summary>
          <div className={s['member-details']}>
            {members.map(m => this.renderMember(m))}
          </div>
        </details>
      </div>
    );
  }

  renderMember(member) {
    // Defaults incase member object is never defined
    let username = 'UnknownAccount';
    let color = 'blue';

    const { currentMember } = this.props;
    const messageFromMe = member.id === currentMember.id;
    // Class depends on whether the current user is the member object being passed
    const className = messageFromMe ? 'self' : 'username';

    // Note -- need to sort out why it comes as member.member.clientData sometimes
    if (member.clientData !== undefined) {
      username = member.clientData.username;
      color = member.clientData.color;
    } else if (!member.member && member.member.clientData !== undefined) {
      username = member.member.clientData.username;
      color = member.member.clientData.color;
    } else {
      this.forceUpdate();
    }
    // Returns a styled member element
    return (
      <div key={member.id}>
        <div className={s[className]} style={{ color }}>
          {username}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Members);
