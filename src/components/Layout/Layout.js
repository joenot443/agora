import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar/Sidebar';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div className={s.app}>
        <Header />
        <div className={s.layout}>
          <Sidebar />
          <div className={s.body}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
