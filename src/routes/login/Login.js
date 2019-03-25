import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import superagent from 'superagent';
import Cookies from 'js-cookie';
import s from './Login.css';
import history from '../../history';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    console.info(props);
    this.state = {
      message: null,
      username: '',
      password: '',
    };
  }

  onSubmit = async e => {
    e.preventDefault();
    console.info(this.state);

    this.setState({ errors: {}, isLoading: true });
    const response = await superagent.post('/api/login').send({
      username: this.state.username,
      password: this.state.password,
    });
    if (response.body.success) this.onLoginSuccess(response.body);
    else this.onLoginFailure();
  };

  onLoginSuccess = result => {
    history.push('/');
    Cookies.set(result.token);
  };

  onLoginFailure = result => {
    this.setState({ message: result.message });
  };

  render() {
    if (this.props.loggedIn)
      return (
        <div className={s.root}>
          <div className={s.container}>
            <h1>{this.props.title}</h1>
            <p>You're already logged in!</p>
          </div>
        </div>
      );
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p className={s.lead}>Log in with your username and password.</p>
          <p className={s.message}>{this.state.message}</p>
          <form method="post" onSubmit={this.onSubmit}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="usernameOrEmail">
                Username or email address:
                <input
                  className={s.input}
                  id="usernameOrEmail"
                  type="text"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">
                Password:
                <input
                  className={s.input}
                  id="password"
                  type="password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(Login);
