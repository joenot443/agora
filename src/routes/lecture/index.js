import React from 'react';
import Layout from '../../components/Layout';
import Lecture from './Lecture';

const title = 'Lecture Us';

function action() {
  return {
    chunks: ['Lecture'],
    title,
    component: (
      <Layout>
        <Lecture title={title} />
      </Layout>
    ),
  };
}

export default action;
