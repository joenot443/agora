import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import isLoggedIn from '../../util/isLoggedIn';

class Navigation extends React.Component {
  render() {
    const loginRegisterLinks = (
      <span>
        <Link className={s.link} to="/login">
          Log in
        </Link>
        <span className={s.spacer}>or</span>
        <Link className={cx(s.link, s.highlight)} to="/register">
          Sign up
        </Link>
      </span>
    );
    const profileLink = (
      <span>
        <Link className={s.link} to="/profile">
          Profile
        </Link>
      </span>
    );
    return (
      <div className={s.root} role="navigation">
        <span className={s.spacer}> | </span>
        {isLoggedIn ? profileLink : loginRegisterLinks}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
