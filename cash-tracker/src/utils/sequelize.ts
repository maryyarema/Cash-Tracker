import { Sequelize } from "sequelize";

export default new Sequelize(
  String(process.env.POSTGRES_DATABASE_NAME),
  String(process.env.POSTGRES_DATABASE_USER),
  process.env.POSTGRES_DATABASE_PASSWORD,
  {
    host: process.env.POSTGRES_DATABASE_HOST,
    port: Number(process.env.POSTGRES_DATABASE_PORT),
    dialect: "postgres",
    logging: false,
    benchmark: true,
    pool: {
      max: 30,
      min: 10,
      acquire: 30000,
      idle: 10000,
    },
  }
);
