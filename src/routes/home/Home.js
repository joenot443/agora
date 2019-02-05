import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import newsQuery from './news.graphql';
import s from './Home.css';
import superagent from 'superagent';

import Preview from '../../components/Lecture/Preview/Preview.js';

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

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      news: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          link: PropTypes.string.isRequired,
          content: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  handleClick = async e => {
    e.preventDefault();
    console.info('clicked get');
    const lectures = (await superagent.get('/lectures')).body.data;
    console.log(lectures);
    this.setState({ lectures });
  };

  handleClick2 = async e => {
    e.preventDefault();
    console.info('clicked get');
    const response = await superagent.post('/createLecture');
    console.log(response);
  };

  render() {
    const {
      data: { loading, reactjsGetAllNews },
    } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* <div className='lecturesbutton' onClick={this.handleClick}>
            <h1>Get LEctures</h1>
          </div>
          <div className='lecturesbutton' onClick={this.handleClick2}>
            <h1>create LEctures</h1>
    </div> */}
          <h1>Upcoming Lectures</h1>

          {this.state.lectures.map(l => <Preview data={l} />)}

          {/* {loading
            ? 'Loading...'
            : reactjsGetAllNews.map(item => (
                <article key={item.link} className={s.newsItem}>
                  <h1 className={s.newsTitle}>
                    <a href={item.link}>{item.title}</a>
                  </h1>
                  <div
                    className={s.newsDesc}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </article>
            ))} */}
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(newsQuery),
)(Home);
