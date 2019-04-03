import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Header.scss';
import Link from '../Link';
import isLoggedIn from '../../util/isLoggedIn';
import { Button } from 'antd';
import logo from './logo2.png';

class Header extends React.Component {
  render() {
    const loginRegisterLinks = (
      <React.Fragment>
        <Link className={s.link} to="/login">
          Log in
        </Link>
        <Link className={s.link} to="/register">
          <Button type="primary" className={s.button} >Sign up</Button>
        </Link>
      </React.Fragment>
      );

    const profileLink = (
      <React.Fragment>
        <Link className={s.link} to="/new-lecture">
          Create Lecture
        </Link>
        <Link className={s.link} to="/logout">
          Log out
        </Link>
      </React.Fragment>
    );

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.left}>
            <Link className={s.brand} to="/">
              <img className={s.logo} src={logo} alt="Logo" />
              {/*<span className={s.brandTxt}>Agora</span>*/}
            </Link>
            <Link className={s.link} to="/browse">
              Browse
            </Link>
          </div>
          <div className={s.right}>
            {isLoggedIn() ? profileLink : loginRegisterLinks}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
