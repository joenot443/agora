import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {};
  static defaultProps = {};
  render() {
    return <div className={s.root}>Hello</div>;
  }
}

export default withStyles(s)(Sidebar);
