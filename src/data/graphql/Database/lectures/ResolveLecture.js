export const schema = [
  `
    # Data for a new Lecture to be inserted into the database
    # A user stored in the local database
    type Lecture {
      id: String
      username: String
      profile: DatabaseUserProfile
      updatedAt: String
      createdAt: String
    }
  `,
];

export const queries = [
  `
    resolveLecture(lectureId: ID!): Lecture
    `,
];

export const resolvers = {
  RootQuery: {
    async resolveLecture(parent, args, context) {
      return null;
    },
  },
};
