import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './LiveBadge.scss';

class LiveBadge extends Component {
  render() {
    return (
      <div className={s.root}>
        Live
      </div>
    )
  }
}

export default withStyles(s)(LiveBadge);
