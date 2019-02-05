import { merge } from 'lodash';

/** * Queries ** */
import {
  schema as GetAllUsers,
  queries as GetAllUsersQueries,
  resolvers as GetAllUsersResolver,
} from './users/GetAllUsers';

import {
  queries as GetLoggedInUserQueries,
  resolvers as GetLoggedInUserResolver,
} from './users/GetLoggedInUser';

import {
  schema as CreateLecture,
  mutations as CreateLectureMutation,
  resolvers as CreateLectureResolver,
} from './lectures/CreateLecture';

import {
  schema as ResolveLecture,
  queries as ResolveLectureQueries,
  resolvers as ResolveLectureResolver,
} from './lectures/ResolveLecture';

/** * Mutations ** */

export const schema = [...GetAllUsers, ...ResolveLecture];

export const queries = [
  ...GetAllUsersQueries,
  ...GetLoggedInUserQueries,
  ...ResolveLectureQueries,
];

export const mutations = [...CreateLectureMutation];

export const resolvers = merge(
  GetAllUsersResolver,
  GetLoggedInUserResolver,
  CreateLectureResolver,
  ResolveLectureResolver,
);
