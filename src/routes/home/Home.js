import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'antd';
import superagent from 'superagent';

import s from './Home.css';
import Preview from '../../components/Lecture/Preview/Preview';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lectures: [],
    };
  }

  componentDidMount = async () => {
    if (!this.state.lectures.length) {
      const lectures = (await superagent.get('/lectures')).body.data;
      this.setState({ lectures });
    }
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Upcoming Lectures</h1>
          {this.state.lectures.map(l => <Preview data={l} />)}
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s))(Home);
