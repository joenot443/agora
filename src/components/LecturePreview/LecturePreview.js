import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './LecturePreview.css';
import Link from '../Link/Link';

class LecturePreview extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };
  render() {
    return (
      <div className={s.root}>
        <Link to={`/join-lecture/${this.props.id}`}>
          <div className={s.previewContainer}>
            <img src="/img.jpg" className={s.img} />
            <div className={s.desc}>
              <span className={s.title}>{this.props.title}</span>
              <span className={s.user}>{this.props.description}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(LecturePreview);
