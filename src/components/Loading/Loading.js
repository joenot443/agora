import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Loading.css';
import { Spin } from 'antd';

export default withStyles(s)(
  class Loading extends PureComponent {
    render() {
      return (
        <div className={s.container}>
          <Spin size="large" />
        </div>
      );
    }
  },
);
