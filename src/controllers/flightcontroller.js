import dataById from '../services/serviceData.js'
import { SeatAssignmentService } from '../services/assigmentServices.js';
import { convertToCamelCase } from '../utils/caseConverter.js';
import { handleAsyncError } from '../utils/errorHandler.js';

const seatService = new SeatAssignmentService();

export const getFlightPassengers = handleAsyncError(async (req, res) => {

   await dataById(req).then((response) => {
      const airplaneSeats = response.seats;
      const passengers = response.passengers;
      const flight = response.flight;
      seatService.assignSeatsToPassengers(passengers, airplaneSeats).then((list) => {
        res.json({
    code: 200,
    data: {
      flightId: flight.fligth_id,
      takeoffDateTime: Math.floor(new Date(flight.takeoff_date_time).getTime() / 1000),
      takeoffAirport: flight.takeoff_airport,
      landingDateTime: Math.floor(new Date(flight.landing_date_time).getTime() / 1000),
      landingAirport: flight.landing_airport,
      airplaneId: flight.airplane_id,
      passengers: convertToCamelCase(list)
    }
  }); }
      )
  // Convertir a camelCase y enviar respuesta
  }).catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
})

});
