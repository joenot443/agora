import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'antd';
import superagent from 'superagent';

import s from './Browse.scss';
import LecturePreview from '../../components/LecturePreview/LecturePreview';

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lectures: [],
      message: null,
    };
  }

  componentDidMount = async () => {
    const response = (await superagent.get('/api/lectures/active')).body;
    if (response.success && response.data.length)
      this.setState({ lectures: response.data });
    else this.setState({ message: response.message });
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Live Lectures</h1>
          {this.state.lectures.length ? (
            this.state.lectures.map(l => <LecturePreview {...l} />)
          ) : (
            <h4>{this.state.message}</h4>
          )}
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s))(Browse);
