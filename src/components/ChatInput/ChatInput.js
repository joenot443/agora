import React, { Component } from 'react';
import s from '../Chatroom/Chatroom.css';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Input extends Component {
  state = {
    text: '',
  };

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  // Sends to the onSendMessage function back in App
  onSubmit(e) {
    e.preventDefault();
    this.setState({ text: '' });
    this.props.onSendMessage(this.state.text, this.props.username);
  }

  handleOnClick = username => {
    this.props.onHandRaise(username);
  };

  render() {
    // We can add a raise hand to the right of the send button
    const { username } = this.props;
    return (
      <div className="Input">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type="text"
            placeholder="Enter your message here..."
            autoFocus
          />
          <button>Send</button>
          <Icon
            style={{ marginLeft: 8, fontSize: 32 }}
            onClick={() => this.handleOnClick(username)}
          >
            pan_tool
          </Icon>
        </form>
      </div>
    );
  }
}

export default withStyles(s)(Input);
