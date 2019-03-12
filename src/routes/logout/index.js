/**
 * DoLyst
 *
 * Copyright © Joe Crozier
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Logout from './Logout';

async function action() {
  return {
    chunks: ['logout'],
    title: 'Logout',
    component: (
      <Layout route="logout">
        <Logout title="Logout" />
      </Layout>
    ),
  };
}

export default action;
