/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const faker = require("faker");

function time() {
  return new Date();
}

let now = time().toLocaleString();

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
  const desiredFakeCustomers = 50;
  for (let i = 0; i < desiredFakeCustomers; i++) {
    fakeCustomers.push(createFakeCustomers());
  }
  // Deletes ALL existing entries
  await knex("customers").del();
  await knex("customers").insert(fakeCustomers);
};
