import { Component } from 'react';
import React from 'react';
import s from '../Chatroom/Chatroom.css';
import Icon from '@material-ui/core/Icon';
import withStyles from 'isomorphic-style-loader/lib/withStyles'; // Change to material ui?

const styles = theme => ({
  icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
    color: theme.palette.text.primary,
  },
})

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

  handleOnClick = (username) => {
    //this.props.onHandRaise(username);
    this.props.onSendMessage("hand_raised", this.props.username);
  }

  render() {
    const { classes, username } = this.props;
    return (
      <div className="Input">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type="text"
            placeholder="Enter your message here..."
            autoFocus={true}
          />
          <button>Send</button>
          <Icon style={{marginLeft: 8, fontSize: 32}} onClick={() => this.handleOnClick(username)}>pan_tool</Icon>
        </form>
      </div>
    );
  }
}

export default withStyles(s)(Input);
