import api from '../api/api';

export function login(data) {
  return dispatch =>
    api
      .post('/login', { username: data.username, password: data.password })
      .then(res => {
        const token = res.data.data;

        setAuthorizationToken(token);
      });
}

export function getAuthorizationToken(token) {
  return localStorage.getItem('jwtToken');
}
export function setAuthorizationToken(token) {
  return localStorage.setItem('jwtToken', token);
}
