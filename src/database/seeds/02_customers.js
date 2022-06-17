/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("customer").del();
  await knex("customer").insert([
    {
      first_name: "John",
      last_name: "Smith",
      email: "john@example.com",
      phone: "919 666 1212",
      company: "Axura",
      notes: "very cool person",
    },
    {
      first_name: "Tricia",
      last_name: "Jeforson",
      email: "hello@hello.com",
      phone: "675 5656",
      company: "vtech",
      notes: "nice",
    },
    {
      first_name: "Kai",
      last_name: "Kor",
      email: "kai@test.com",
      phone: "none",
      company: "none",
      notes: "she is a puppy",
    },
  ]);
};
