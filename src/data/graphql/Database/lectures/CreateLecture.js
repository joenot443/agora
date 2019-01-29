export const schema = [
  `
`,
];

export const mutations = [
  `
  # Creates a new user and profile in the local database
  databaseCreateLecture(
    # A display name for the logged-in user
    title: String!

    # A profile picture URL
    description: String

    # The user's location
    location: String

    # A website URL
    website: String
  ): Lecture
`,
];

export const resolvers = {
  Mutation: {
    async databaseCreateLecture(parent, args) {
      // If user already exists, throw error
      //   const lookupUser = await User.findOne({ where: { email: args.email } });

      //   if (lookupUser) {
      //     // eslint-disable-next-line no-throw-literal
      //     throw 'User already exists!';
      //   }

      //   // Create new user with profile in database
      //   const user = await User.create(
      //     {
      //       email: args.email,
      //       profile: {
      //         ...args.profile,
      //       },
      //     },
      //     {
      //       include: [{ model: UserProfile, as: 'profile' }],
      //     },
      //   );

      return null;
    },
  },
};
