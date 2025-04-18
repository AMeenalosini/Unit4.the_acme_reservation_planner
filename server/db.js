const pg = require("pg");
const uuid = require("uuid");
require("dotenv");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_reservation_planner"
);

async function createTables() {
  //droppings the tables
  //create the tables
  const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;

        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            reservation_date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
            customer_id UUID REFERENCES customer(id) NOT NULL
        );
    `;

  await client.query(SQL);
}

async function createCustomers(name) {
  const SQL = `INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
}

async function fetchCustomers() {
  const SQL = `SELECT * FROM customer;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function createRestaurants(name) {
  const SQL = `INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
}

async function fetchRestaurants() {
  const SQL = `SELECT * FROM restaurant;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function createReservations({ reservation_date, party_count, restaurant_id, customer_id}) {
  const SQL = `INSERT INTO reservation(id, reservation_date, party_count, restaurant_id, customer_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    reservation_date,
    party_count,
    restaurant_id,
    customer_id
  ]);
  return dbResponse.rows[0];
}

async function fetchReservations() {
  const SQL = `SELECT * FROM reservation;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function destroyReservations(id, customer_id) {
  const SQL = `DELETE FROM reservation WHERE id=$1 AND customer_id=$2`;
  await client.query(SQL, [id, customer_id]);
}

module.exports = {
  client,
  createTables,
  createCustomers,
  fetchCustomers,
  createRestaurants,
  fetchRestaurants,
  createReservations,
  fetchReservations,
  destroyReservations,
};