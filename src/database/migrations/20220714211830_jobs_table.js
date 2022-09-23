/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // JOBS table
  return knex.schema.createTable("job", (tbl) => {
    tbl.increments();
    tbl.date("dueDate").notNullable();
    tbl.date("createdAt").defaultTo(knex.fn.now());
    tbl.date("updatedAt");
    tbl.string("title", 128).notNullable();
    tbl.string("description", 256).notNullable();
    tbl.enu("inProgress", ["OPEN", "IN-PROGRESS", "CLOSED"]).defaultTo("OPEN");
    tbl
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user");
    tbl
      .integer("customerId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("customer");
    tbl.integer("adminId").notNullable();
    tbl.boolean("isDeleted").defaultTo(false);
    tbl.float("total", 2).defaultTo(0);
    tbl.float("balance", 2).defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("job");
};
