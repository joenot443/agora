import React from 'react';
import Layout from '../../components/Layout';
import JoinLecture from './JoinLecture';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const title = 'Join a Lecture';

function action() {
  return {
    chunks: ['join-lecture'],
    title,
    component: (
      <Layout>{canUseDOM ? <JoinLecture title={title} /> : 'No SSR'}</Layout>
    ),
  };
}

export default action;
