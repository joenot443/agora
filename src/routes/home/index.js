import React from 'react';
import Home from './Home';
import newsQuery from './news.graphql';
import Layout from '../../components/Layout';

async function action({ client }) {
  const data = await client.query({
    query: newsQuery,
  });
  return {
    title: 'React Starter Kit',
    chunks: ['home'],
    component: (
      <Layout>
        <Home news={data.reactjsGetAllNews} />
      </Layout>
    ),
  };
}

export default action;
