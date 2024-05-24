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

export const update = {
  type: "object",
  required: ["id", "name"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    name: {
      type: "string",
      minLength: 1,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      id: "id should be a string of uuid format",
      name: "name should be a string",
    },
    required: {
      id: 'should have a string property "id"',
      name: 'should have a string property "name"',
    },
  },
};
