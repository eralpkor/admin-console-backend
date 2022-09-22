// Update with your config settings.
require("dotenv").config({ path: "./.env" });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host:
        process.env.DATABASE_URL ||
        "postgresql://localhost:5432/adminconsoledb2",
      user: "postgres",
      password: process.env.USER_PASSWORD,
      database: "adminconsoledb2",
      schema: "aexperts",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: { directory: "./src/database/seeds" },
    useNullAsDefault: true,
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_URL,
      user: "postgres",
      password: process.env.USER_PASSWORD,
      database: "adminconsoledb2",
      schema: "aexperts",
    },
    pool: {
      min: 2,
      max: 100,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: { directory: "./src/database/seeds" },
    useNullAsDefault: true,
  },
};
