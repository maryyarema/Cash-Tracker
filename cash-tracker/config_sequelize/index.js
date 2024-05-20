require("dotenv/config")

module.exports = {
  development: {
    migrationStorageTableName: "sequelize_migrations",
    dialect: "postgres",
    username: process.env.POSTGRES_DATABASE_USER,
    database: process.env.POSTGRES_DATABASE_NAME,
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    host: process.env.POSTGRES_DATABASE_HOST,
    port: process.env.POSTGRES_DATABASE_PORT,
  },
};
