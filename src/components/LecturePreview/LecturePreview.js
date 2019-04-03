import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './LecturePreview.scss';
import Link from '../Link/Link';
import LiveBadge from '../LiveBadge/LiveBadge';

class LecturePreview extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };
  render() {
    return (
      <Link className={s.root} to={`/join-lecture/${this.props.id}`}>
        <div className={s.previewContainer}>
          <div className={s.img}>
            <LiveBadge />
          
          </div>
          <div className={s.desc}>
            <span className={s.title}>{this.props.title}</span>
            <span className={s.user}>{this.props.description}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default withStyles(s)(LecturePreview);
