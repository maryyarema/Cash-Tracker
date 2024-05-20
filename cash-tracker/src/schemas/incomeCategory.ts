export const create = {
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: "name should be a string",
    },
    required: {
      name: 'should have a string property "name"',
    },
  },
};
