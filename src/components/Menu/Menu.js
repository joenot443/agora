import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Header.css';
import Link from '../Link';
import isLoggedIn from '../../util/isLoggedIn';

class Header extends React.Component {
  render() {
    const loginRegisterLinks = (
      <span>
        <Link className={s.link} to="/login">
          Log in
        </Link>
        <span className={s.spacer}>or</span>
        <Link className={s.link} to="/register">
          Sign up
        </Link>
      </span>
    );

    const profileLink = (
      <span>
        <Link className={s.link} to="/new-lecture">
          Create Lecture
        </Link>
        <span className={s.spacer}> | </span>
        <Link className={s.link} to="/logout">
          Logout
        </Link>
      </span>
    );






    return (
      <div className={s.root}>
        <div className={s.container}>
        <div className={s.nav} role="navigation">
          {isLoggedIn() ? profileLink : loginRegisterLinks}
        </div>
          <Link className={s.brand} to="/">
            <span className={s.brandTxt}>Agora</span>
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
