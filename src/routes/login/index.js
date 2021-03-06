import React from 'react';
import Layout from '../../components/Layout';
import Login from './Login';
import isLoggedIn from '../../util/isLoggedIn';

const title = 'Log In';

function action() {
  return {
    chunks: ['login'],
    title,
    component: (
      <Layout>
        <Login title={title} loggedIn={isLoggedIn()} />
      </Layout>
    ),
  };
}

export default action;
