/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const faker = require("faker");

var timestamp = new Date().toLocaleDateString();

const createFakeCustomers = () => ({
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  company: faker.company.companyName(),
  notes: faker.random.words(7),
});

exports.seed = async function (knex) {
  const fakeCustomers = [];
  const desiredFakeCustomers = 20;
  for (let i = 0; i < desiredFakeCustomers; i++) {
    fakeCustomers.push(createFakeCustomers());
  }
  // Deletes ALL existing entries
  await knex("customers").del();
  await knex("customers").insert(fakeCustomers);
};
