import data from "../models/query.js";

const dataById = async (flightId) => {
  const queryFlightInfo = `
    SELECT
      f.flight_id,
      f.takeoff_date_time,
      f.takeoff_airport,
      f.landing_date_time,
      f.landing_airport,
      f.airplane_id 
    FROM flight f
    WHERE f.flight_id = ?;
  `;

  const queryPassengers = `
    SELECT
    p.passenger_id,
    p.dni,
    p.name,
    p.age,
    p.country,
    b.boarding_pass_id,
    b.purchase_id,
    b.seat_type_id,
    b.seat_id
    FROM passenger p
    JOIN boarding_pass b ON p.passenger_id = b.passenger_id
    WHERE b.flight_id = ?
   ORDER BY b.purchase_id;
  `;
  const querySeats = `
    SELECT
      s.seat_id,
      s.seat_column,
      s.seat_row,
      s.seat_type_id,
      s.airplane_id
    FROM seat s
    JOIN flight f ON f.airplane_id = s.airplane_id
    WHERE f.flight_id = ?
    ;
  `

  try {
    const [flightInfo, passengers, seats] = await Promise.all([
      data(queryFlightInfo, [flightId]),
      data(queryPassengers, [flightId]),
      data(querySeats, [flightId])
    ]);

    if (flightInfo.length === 0) {
      console.warn(`No se encontró ningún vuelo con el ID: ${flightId}`);
      return null;
    }

    const response = {
      flight: flightInfo[0],
      passengers,
      seats
    };
    return response;
  } catch (error) {
    console.error(
      `Ocurrió un error al procesar la simulación para el vuelo ID ${flightId}:`,
      error
    );
    throw error;
  }
};

export default dataById;
