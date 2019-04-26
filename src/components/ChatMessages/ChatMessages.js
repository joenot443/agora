import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';

class Messages extends Component {
  state = {
    anchorEl: null,
    open: false
  };

  handleClick = event => {
    const {currentTarget} = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };

  handleButtonClick(username) {
    this.setState(state => ({ 
      open: !state.open
    }));
    this.props.onMemberMuted(username);
  }
  
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
    const {member, text} = message;
    const {currentMember, classes, mutedList} = this.props;
    const { anchorEl, open} = this.state;
    const id = open ? 'simple-popper' : null;
    //const messageFromMe = member.id === currentMember.id;
    const className =  "Messages-message";
    if (!mutedList.includes(member.clientData.username)) {
    return (
      <li className={className}>
      <span
        className="avatar"
        style={{backgroundColor: member.clientData.color}}
      />
      <div>
        <div className="Message-content" onClick={this.handleClick}>
          <div className="username">
            {member.clientData.username}
          </div>
          <div className="text">{text}</div>
        </div>
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}  timeout={350}>
              <Paper className={classes.Paper}>
                <DialogContent>
                      <DialogContentText>
                        {member.clientData.username}
                      </DialogContentText>
                    </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.handleButtonClick(member.clientData.username)} color="primary">
                    Mute
                  </Button>
                  <Button>
                    Ban
                  </Button>
                </DialogActions>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
      </li>
    );
    }
  }
}

const styles = theme => ({
  typography: {
    padding: theme.spacing.unit * 2,
  },
  Paper: {
    maxWidth: 400,
    overflow: 'auto',
  },
});

Messages.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Messages);
