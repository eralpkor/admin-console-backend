/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const faker = require("faker");

var timestamp = new Date().toLocaleDateString();

const createFakeCustomers = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  company: faker.company.companyName(),
  comment: faker.random.words(7),
  updatedAt: timestamp,
  createdAt: timestamp,
});

exports.seed = async function (knex) {
  const fakeCustomers = [];
  const desiredFakeCustomers = 50;
  for (let i = 0; i < desiredFakeCustomers; i++) {
    fakeCustomers.push(createFakeCustomers());
  }
  // Deletes ALL existing entries
  await knex("customer").del();
  await knex("customer").insert(fakeCustomers);
};
