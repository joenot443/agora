import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';

import { connect } from 'react-redux';
import { login } from '../../actions/auth';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      username: '',
      password: '',
    };
  }

  handleSubmit = async e => {
    e.preventDefault();
    console.info(this.state);

    this.setState({ errors: {}, isLoading: true });
    const response = await this.props.login(this.state);
    console.log('login response:');
    console.log(response);
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p className={s.lead}>Log in with your username and password.</p>

          <form method="post" onSubmit={this.handleSubmit}>
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

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(
  null,
  { login },
)(withStyles(s)(Login));
