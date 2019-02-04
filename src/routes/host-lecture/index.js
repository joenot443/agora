import React from 'react';
import Layout from '../../components/Layout';
import HostLectureSSRContainer from './HostLectureSSRContainer';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const title = 'Host a Lecture';

function action() {
  return {
    chunks: ['host-lecture'],
    title,
    component: (
      <Layout>
        {canUseDOM ? <HostLectureSSRContainer title={title} /> : 'No SSR'}
      </Layout>
    ),
  };
}

export default action;
