/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const faker = require("faker");

function time() {
  return new Date();
}

let now = time().toLocaleString();

const progress = ["OPEN", "IN-PROGRESS", "CLOSED"];

Array.prototype.randomProgress = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function createThreeDigit() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const createFakeJobs = () => ({
  title: faker.random.words(),
  description: faker.random.words(10),
  dueDate: now,
  updatedAt: now,
  inProgress: "OPEN",
  userId: randomNumber(4, 7),
  customerId: randomNumber(1, 20),
  adminId: randomNumber(1, 3),
  total: 1000.0,
});

exports.seed = async function (knex) {
  const fakeJobs = [];
  const desiredFakeJobs = 20;
  for (let i = 0; i < desiredFakeJobs; i++) {
    fakeJobs.push(createFakeJobs());
  }
  // Deletes ALL existing entries
  await knex("job").del();
  await knex("job").insert(fakeJobs);
};
