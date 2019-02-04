import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HostLecture from './HostLecture';

export default class HostLectureSSRContainer extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return <HostLecture title={this.props.title} />;
  }
}
