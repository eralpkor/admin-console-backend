/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const faker = require("faker");

function time() {
  return new Date();
}

let now = time().toLocaleString();

const progress = ["open", "in-progress", "closed"];

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
  job_title: faker.random.words(),
  job_description: faker.random.words(10),
  due_date: now,
  balance: 250.75,
  amount_paid_1: 0,
  amount_paid_2: 0,
  amount_paid_3: 0,
  customer_id: randomNumber(1, 50),
  user_id: randomNumber(1, 4),
  in_progress: progress.randomProgress(),
  created_at: now,
  assigned_to: randomNumber(1, 4),
});

exports.seed = async function (knex) {
  const fakeJobs = [];
  const desiredFakeJobs = 50;
  for (let i = 0; i < desiredFakeJobs; i++) {
    fakeJobs.push(createFakeJobs());
  }
  // Deletes ALL existing entries
  await knex("jobs").del();
  await knex("jobs").insert(fakeJobs);
};
