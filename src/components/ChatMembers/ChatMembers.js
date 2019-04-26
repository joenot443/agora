import React, { Component } from 'react';
import Icon from "@material-ui/core/Icon";
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
        var username = "UnknownAccount";
        var color = "blue";
        var handUp = false;

        const {currentMember, hands} = this.props;
        const messageFromMe = member.id === currentMember.id;
        // Class depends on whether the current user is the member object being passed
        const className = messageFromMe ? 
        "self" : "username"
        
        // Note -- need to sort out why it comes as member.member.clientData sometimes
        if (member.clientData !== undefined){
            username = member.clientData.username;
            if (hands.includes(username)) {
                handUp = true;
            }
            color = member.clientData.color;
        }
        else if (member.member.clientData !== undefined) {
            username = member.member.clientData.username;
            if (hands.includes(username)) {
                handUp = true;
            }
            color = member.member.clientData.color;
        } else {
            //this.forceUpdate();
        }
        // Returns a styled member element
        if (handUp) {
            return (
                <div>
                    <div className={className} style={{color: color}}>
                        {username}
                        <Icon style={{marginLeft: 4, fontSize: 14}}>pan_tool</Icon>
                    </div>
                </div>
            )
        }
        else {
            return(
                <div>
                    <div className={className} style={{color: color}}>
                        {username}
                    </div>
                </div>
            )
        }
    }
}

export default withStyles(s)(Members);
