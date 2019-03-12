/**
 * DoLyst
 *
 * Copyright © Joe Crozier
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Cookies from 'js-cookie';
import s from './Logout.css';
import history from '../../history';

class Logout extends React.Component {
  componentDidMount = () => {
    this.onLogout();
  };

  onLogout = () => {
    Cookies.remove('token');
    history.push('/');
  };

  render() {
    return (
      <div className="root">
        <div className={s.container}>
          <h3>You've been logged out. Please wait to be redirected.</h3>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Logout);
