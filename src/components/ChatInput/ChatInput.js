import { Component } from 'react';
import React from 'react';
import s from '../Chatroom/Chatroom.css';

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
    this.props.onSendMessage(this.state.text);
  }

  render() {
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
        </form>
      </div>
    );
  }
}

export default withStyles(s)(Input);
