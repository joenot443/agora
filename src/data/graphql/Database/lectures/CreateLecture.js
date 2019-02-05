import { Lecture } from 'data/models';

export const schema = [
  `
`,
];

export const mutations = [
  `
  # Creates a new lecture in the local database
  databaseCreateLecture(
    # A name for the lecture
    title: String!

    # A picture URL
    description: String

  ): Lecture
`,
];

export const resolvers = {
  Mutation: {
    async databaseCreateLecture(parent, args) {
      // Create new user with profile in database
      const lecture = await Lecture.create({
        title: 'lecture title 1',
        description: 'desc',
        startTime: 'ok',
        url: 'url',
      });

      return lecture;
    },
  },
};
