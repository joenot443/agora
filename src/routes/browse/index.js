import React from 'react';
import Browse from './Browse';
import lecturesQuery from './news.graphql';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'Agora - Browse',
    chunks: ['browse'],
    component: (
      <Layout>
        <Browse />
      </Layout>
    ),
  };
}

export default action;
