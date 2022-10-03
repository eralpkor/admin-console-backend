/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("payment", (tbl) => {
    tbl.increments();
    tbl.date("createdAt").defaultTo(knex.fn.now());
    tbl.date("updatedAt");
    tbl
      .enu("paymentType", ["CASH", "CHECK", "CREDIT", "ACH"])
      .defaultTo("CASH");
    tbl
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user");
    tbl.integer("editedBy");
    tbl.float("amountPaid", 2).defaultTo(0);
    tbl
      .integer("jobId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("job");
    tbl.boolean("isDeleted").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("payment");
};
