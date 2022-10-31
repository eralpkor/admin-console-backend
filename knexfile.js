// Update with your config settings.
require("dotenv").config({ path: "./.env" });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  // For Docker, it's working
  // development: {
  //   // Docker setup
  //   client: "pg",
  //   connection: {
  //     host: "db",
  //     user: "postgres",
  //     password: "password",
  //     database: "postgres",
  //   },
  //   migrations: {
  //     directory: "./src/database/migrations",
  //   },
  //   seeds: { directory: "./src/database/seeds" },
  //   useNullAsDefault: true,
  // },
  // For local install database
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      // process.env.DATABASE_URL ||
      // "postgresql://localhost:5432/adminconsoledb2",
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
  // development: {
  //   client: "pg",
  //   connection: {
  //     host:
  //       process.env.DATABASE_URL || "postgresql://localhost:2022/admin-console",
  //     user: process.env.DB_USER || "postgres",
  //     password: process.env.DB_PASSWORD || "postgres",
  //   },
  //   migrations: {
  //     directory: "./src/database/migrations",
  //   },
  //   seeds: { directory: "./src/database/seeds" },
  //   useNullAsDefault: true,
  // },

  production: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_URL || "postgres://localhost:2022/postgres",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
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

// module.exports = knex({
//   client: "pg",
//   connection: {
//     host: "localhost",
//     user: "postgres",
//     password: "password",
//     database: "admin-console"
//   }
// })
