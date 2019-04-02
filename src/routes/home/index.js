import React from 'react';
import Home from './Home';
import lecturesQuery from './news.graphql';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'Agora - Home',
    chunks: ['home'],
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
