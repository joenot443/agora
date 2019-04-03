import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './CategoryCard.scss';

class CategoryCard extends Component {
  render() {
    return (
      <div className={s.root}>
        Live
      </div>
    )
  }
}

export default withStyles(s)(CategoryCard);
