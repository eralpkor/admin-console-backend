/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("roles", (tbl) => {
      tbl.increments();
      tbl.string("role").notNullable();
    })

    .createTable("user_roles", (tbl) => {
      tbl.increments("user_role_id");
      tbl.integer("user_id").notNullable();
      tbl.integer("role_id").notNullable();

      tbl.foreign("user_id").references("id").inTable("users");
      tbl.foreign("role_id").references("id").inTable("roles");
      tbl.unique("user_id", "role_id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_role").dropTableIfExists("role");
};
