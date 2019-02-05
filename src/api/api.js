import axios from 'axios';
import { getAuthorizationToken } from '../actions/auth';

axios.interceptors.request.use(config => {
  const token = getAuthorizationToken();
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.common.Authorization;
  }
  return config;
});

export default axios;
