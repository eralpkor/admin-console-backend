// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./src/database/admin.db3" },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
      tableName: "dbmigrations",
    },
    seeds: { directory: "./src/database/seeds" },
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
      },
    },
  },

  // deploy to heroku
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 100,
    },
    migrations: {
      directory: "./src/database/migrations",
      tableName: "dbmigrations",
    },
    seeds: { directory: "./src/database/seeds" },
  },
};
