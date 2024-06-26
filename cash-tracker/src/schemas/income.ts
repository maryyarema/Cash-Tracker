import config from "config";

const { CASH, CARD }: Record<string, string> = config.get(
  "INCOMES_AND_EXPENSES.TYPES"
);

export const create = {
  type: "object",
  required: ["type", "date", "amount", "categoryId"],
  properties: {
    type: {
      type: "string",
      enum: [CASH, CARD],
    },
    date: {
      type: "string",
      format: "date-time",
    },
    amount: {
      type: "number",
      minimum: 0,
    },
    categoryId: {
      type: "string",
      format: "uuid",
    },
    description: {
      type: "string",
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      type: `type should be a string, allowed values are '${CASH}' and '${CARD}'`,
      date: "date should be a string in timestamp format",
      amount: "amount should be a positive number",
      categoryId: "categoryId should be a string in uuid format",
      description: "description should be a string",
    },
    required: {
      type: 'should have a string property "type"',
      date: 'should have a string property "date"',
      amount: 'should have a number property "amount"',
      categoryId: 'should have a string property "categoryId"',
    },
  },
};

export const update = {
  type: "object",
  required: ["id", "type", "date", "amount", "categoryId"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    type: {
      type: "string",
      enum: [CASH, CARD],
    },
    date: {
      type: "string",
      format: "date-time",
    },
    amount: {
      type: "number",
      minimum: 0,
    },
    categoryId: {
      type: "string",
      format: "uuid",
    },
    description: {
      type: "string",
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      id: "id should be a string of uuid format",
      type: `type should be a string, allowed values are '${CASH}' and '${CARD}'`,
      date: "date should be a string in timestamp format",
      amount: "amount should be a positive number",
      categoryId: "categoryId should be a string in uuid format",
      description: "description should be a string",
    },
    required: {
      id: 'should have a string property "id"',
      type: 'should have a string property "type"',
      date: 'should have a string property "date"',
      amount: 'should have a number property "amount"',
      categoryId: 'should have a string property "categoryId"',
    },
  },
};
