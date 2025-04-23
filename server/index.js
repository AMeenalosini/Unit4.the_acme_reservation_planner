const {
    client,
    createTables,
    createCustomers,
    fetchCustomers,
    createRestaurants,
    fetchRestaurants,
    createReservations,
    fetchReservations,
    destroyReservations
  } = require("./db");
  const express = require("express");
  const morgan = require("morgan");
  
  const server = express();
  client.connect();
  
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`listening on port ${port}`));
  
  server.use(morgan("dev"));
  server.use(express.json());
  
  server.get("/api/customers", async (req, res, next) => {
    try {
      const customers = await fetchCustomers();
      res.send(customers);
    } catch (error) {
      next(error);
    }
  });
  
  server.get("/api/restaurants", async (req, res, next) => {
    try {
      const restaurants = await fetchRestaurants();
      res.send(restaurants);
    } catch (error) {
      next(error);
    }
  });
  
  server.get("/api/reservations", async (req, res, next) => {
    try {
      const reservations = await fetchReservations();
      res.send(reservations);
    } catch (error) {
      next(error);
    }
  });
  
  //server.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
    server.post("/api/reservations", async (req, res, next) => {
    try {
      const reservation = await createReservations({
        reservation_date: req.body.reservation_date,
        party_count: req.body.party_count,
        restaurant_id: req.body.restaurant_id,
        customer_id: req.body.customer_id,
      });
      res.send(reservation);
    } catch (error) {
      next(error);
    }
  });
  
  //server.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
    server.delete("/api/reservations/:id", async (req, res, next) => {
    try {
      await destroyReservations(req.params.id, req.body.customer_id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
  
  //error handling route which returns an object with an error property
  server.use((err, req, res) => {
    res.status(err.status || 500).send({ error: err.message || err });
  });