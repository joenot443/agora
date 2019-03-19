import React from 'react';
import Layout from '../../components/Layout';
import HostLecture from './HostLecture';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const title = 'Host a Lecture';

function action(context) {
  const lectureId = context.params['0'] ? context.params['0'] : null;
  return {
    chunks: ['host-lecture'],
    component: (
      <Layout>
        {canUseDOM ? <HostLecture lectureId={lectureId} /> : 'No SSR'}
      </Layout>
    ),
  };
}

export default action;
