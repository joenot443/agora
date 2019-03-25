import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import superagent from 'superagent';
import s from './Register.css';
import history from '../../history';

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      username: '',
      password: '',
      name: '',
    };
  }

  handleSubmit = async e => {
    e.preventDefault();
    console.info(this.state);
    const response = await superagent.post('/api/register').send({
      username: this.state.username,
      password: this.state.password,
      name: this.state.name,
    });
    console.info(response.body);
    if (response.body.success) history.push('/');
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p className={s.lead}>Register for an Agora account!</p>

          <form method="post" onSubmit={this.handleSubmit}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="username">
                Username:
                <input
                  className={s.input}
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
                  type="password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="name">
                Full name:
                <input
                  className={s.input}
                  type="text"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Register);
