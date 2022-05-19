const updateUserSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        imageUrl: { type: "string" },
        description: { type: "string" },
        title: { type: "string" },
        twitterUserName: { type: "string" },
      },

      minProperties: 1,
    },
    pathParameters: {
      type: "object",
      properties: {
        portfolioId: { type: "string" },
      },
      required: ["portfolioId"],
    },
  },
};

const getUserSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        portfolioId: { type: "string" },
      },
      required: ["portfolioId"],
    },
  },
};

module.exports = { updateUserSchema, getUserSchema };
