import React from 'react';
import Layout from '../../components/Layout';
import NewLecture from './NewLecture';

const title = 'New Lecture';

function action() {
  return {
    chunks: ['new-lecture'],
    title,
    component: (
      <Layout>
        <NewLecture />
      </Layout>
    ),
  };
}

export default action;
