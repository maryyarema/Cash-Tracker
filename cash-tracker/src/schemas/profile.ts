export const update = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    email: {
      type: "string",
      format: "email",
      transform: ["trim", "toLowerCase"],
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: "name should be a string",
      email: "email should be a string of email format",
    },
    required: {
      name: 'should have a string property "name"',
      email: 'should have a string property "email"',
    },
  },
};

export const changePassword = {
  type: "object",
  required: ["newPassword", "currentPassword"],
  properties: {
    newPassword: {
      type: "string",
      minLength: 8,
    },
    currentPassword: {
      type: "string",
      minLength: 8,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      newPassword: "newPassword should be a string, minimum length 8",
      currentPassword: "currentPassword should be a string, minimum length 8",
    },
    required: {
      newPassword: 'should have a string property "newPassword"',
      currentPassword: 'should have a string property "currentPassword"',
    },
  },
};
