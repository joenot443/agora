import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'antd';
import superagent from 'superagent';
import logo from './logo.png';

import s from './Home.scss';
import LecturePreview from '../../components/LecturePreview/LecturePreview';
import LiveBadge from '../../components/LiveBadge/LiveBadge';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div className={s.root}>
        <div className={s.banner}>
          <span className={s.active}>Featured</span>
          <span>Science</span>
          <span>Languages</span>
          <span>History</span>
          <div></div>
        </div>
        <div className={s.container}>
          <div className={s.left}>
            <div className={s.preview} id={s.one}>
              <div className={s.overlay}>
                <LiveBadge />
                <div className={s.desc}>
                  <p>Amazing Lecture at MIT</p>
                  <p>SomeGuy2394</p>
                </div>
              </div>
            </div>
            <div className={s.preview} id={s.two}>
              <div className={s.overlay}>
                <LiveBadge />
                <div className={s.desc}>
                  <p>Amazing Lecture at MIT</p>
                  <p>SomeGuy2394</p>
                </div>
              </div>
            </div>
          </div>
          <div className={s.preview} id={s.three}>
            <div className={s.overlay}>
              <LiveBadge />
              <div className={s.desc}>
                <p>Amazing Lecture at MIT</p>
                <p>SomeGuy2394</p>
              </div>
            </div>
          </div>
          <div className={s.right}>
            <div className={s.preview} id={s.four}>>
              <div className={s.overlay}>
                <LiveBadge />
                <div className={s.desc}>
                  <p>Amazing Lecture at MIT</p>
                  <p>SomeGuy2394</p>
                </div>
              </div>
            </div>
            <div className={s.preview} id={s.five}>
              <div className={s.overlay}>
                <LiveBadge />
                <div className={s.desc}>
                  <p>Amazing Lecture at MIT</p>
                  <p>SomeGuy2394</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={s.cta}>
          <div className={s.left}>
            <div className={s.inner}>
              <img className={s.logo} src={logo} alt="Logo" />
            </div>
          </div>
          <div className={s.right}>
            <div className={s.text}>
              Welcome to Agora!<br></br>
              Sign up for the best experience.
            </div>
            <Button type="primary" className={s.button} size="large">Sign up</Button>
          </div>
        </div>
        <div className={s.categories}>
          <h1>Categories</h1>
          <div className={s.cards}>
            <CategoryCard />
            <CategoryCard />
            <CategoryCard />
            <CategoryCard />
            <CategoryCard />
            <CategoryCard />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s))(Home);
