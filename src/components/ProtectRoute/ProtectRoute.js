import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ProtectRoute extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    loggedIn: PropTypes.bool.isRequired,
  };

  componentDidMount() {}

  render() {
    return this.props.loggedIn ? (
      <div className="">{this.props.children}</div>
    ) : (
      <p>You must be logged in! </p>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
});

export default connect(mapStateToProps)(ProtectRoute);
