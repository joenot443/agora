import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Preview.css';

class Preview extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.previewContainer}>
          <img src="/img.jpg" className={s.img} />
          <div className={s.desc}>
            <span className={s.title}>{this.props.data.title}</span>
            <span className={s.user}>{this.props.data.description}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Preview);
