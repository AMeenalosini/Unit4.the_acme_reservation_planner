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
  
  const init = async () => {
    await client.connect();
    console.log("connected to database");
  
    createTables();
    console.log("tables created ");
  
    const [Meena, Ram, Sri, icc, magiano, stomato, ogarden] = await Promise.all([
      createCustomers("Meena"),
      createCustomers("Ram"),
      createCustomers("Sri"),
      createRestaurants("ICC"),
      createRestaurants("Magiano"),
      createRestaurants("SweetTomato"),
      createRestaurants("OliveGarden"),
    ]);
    console.log("customers and restaurants created");
  
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
  
    const [vaca1] = await Promise.all([
      createReservations({
        reservation_date: "04/25/2025",
        party_count: 4,
        restaurant_id: icc.id,
        customer_id: Meena.id,
      }),
      createReservations({
        reservation_date: "04/26/2025",
        party_count: 3,
        restaurant_id: stomato.id,
        customer_id: Sri.id,
      }),
    ]);
    console.log("reservations created");
  
    console.log(await fetchReservations());
  
    await destroyReservations(vaca1.id, Meena.id);
    console.log("deleted reservation");
  
    console.log(await fetchReservations());
  
    await client.end();
  };
  
  init();