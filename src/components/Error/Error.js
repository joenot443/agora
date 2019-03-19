import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import s from './Error.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

export default withStyles(s)(
  class Error extends PureComponent {
    static propTypes = {
      message: PropTypes.string.isRequired,
    };
    render() {
      return (
        <div className={s.container}>
          <h4 className={s.message}>{this.props.message}</h4>
        </div>
      );
    }
  },
);
