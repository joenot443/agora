import React from 'react';
import Layout from '../../components/Layout';
import JoinLecture from './JoinLecture';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const title = 'Join a Lecture';

function action(context) {
  const lectureId = context.params['0'] ? context.params['0'] : null;

  return {
    chunks: ['join-lecture'],
    title,
    component: (
      <Layout>
        <JoinLecture title={title} lectureId={lectureId} />
      </Layout>
    ),
  };
}

export default action;
