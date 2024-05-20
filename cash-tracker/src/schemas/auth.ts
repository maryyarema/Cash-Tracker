export const signup = {
  type: "object",
  required: ["name", "email", "password"],
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
    password: {
      type: "string",
      minLength: 8,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: "name should be a string",
      email: "email should be a string of email format",
      password: "password should be a string, minimum length 8",
    },
    required: {
      name: 'should have a string property "name"',
      email: 'should have a string property "email"',
      password: 'should have a string property "password"',
    },
  },
};

export const login = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      transform: ["trim", "toLowerCase"],
    },
    password: {
      type: "string",
      minLength: 8,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      email: "email should be a string of email format",
      password: "password should be a string, minimum length 8",
    },
    required: {
      email: 'should have a string property "email"',
      password: 'should have a string property "password"',
    },
  },
};
