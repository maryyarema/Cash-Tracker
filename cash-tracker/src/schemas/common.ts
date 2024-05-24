export const validateUUIDPathParameter = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
  },
  errorMessage: {
    properties: {
      id: "Path id parameter should be string of uuid format",
    },
    required: {
      id: 'should have a string property "id"',
    },
  },
};
