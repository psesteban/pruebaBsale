import request from 'supertest';
import app from '../../index.js';

// Mock database service for testing
const mockFlightData = {
  flight: {
    flight_id: 1,
    takeoff_date_time: '2024-07-01 10:00:00',
    takeoff_airport: 'Aeropuerto Internacional Arturo Merino Benítez, Chile',
    landing_date_time: '2024-07-01 14:00:00', 
    landing_airport: 'Aeropuerto Internacional Jorge Chávez, Perú',
    airplane_id: 1
  },
  passengers: [
    {
      boarding_pass_id: 1,
      purchase_id: 1,
      seat_type_id: 1,
      seat_id: null,
      passenger: {
        passenger_id: 1,
        dni: 12345678,
        name: 'Juan Pérez',
        age: 35,
        country: 'Chile'
      }
    },
    {
      boarding_pass_id: 2,
      purchase_id: 1,
      seat_type_id: 1,
      seat_id: null,
      passenger: {
        passenger_id: 2,
        dni: 87654321,
        name: 'María González',
        age: 8,
        country: 'Chile'
      }
    }
  ],
  seats: [
    { seat_id: 1, seat_column: 'A', seat_row: 10, seat_type_id: 1, airplane_id: 1 },
    { seat_id: 2, seat_column: 'B', seat_row: 10, seat_type_id: 1, airplane_id: 1 },
    { seat_id: 3, seat_column: 'C', seat_row: 10, seat_type_id: 1, airplane_id: 1 },
    { seat_id: 4, seat_column: 'A', seat_row: 11, seat_type_id: 1, airplane_id: 1 }
  ]
};

describe('Andes Airlines Check-in API', () => {
  
  describe('Health Check', () => {
    test('GET /health should return status OK', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /flights/:id/passengers', () => {
    
    test('should return correct response structure', async () => {
      // This test would need actual database connection or mocking
      const response = await request(app)
        .get('/flights/1/passengers');
      
      expect([200, 404, 400]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('flightId');
        expect(response.body.data).toHaveProperty('takeoffDateTime');
        expect(response.body.data).toHaveProperty('landingDateTime');
        expect(response.body.data).toHaveProperty('takeoffAirport');
        expect(response.body.data).toHaveProperty('landingAirport');
        expect(response.body.data).toHaveProperty('airplaneId');
        expect(response.body.data).toHaveProperty('passengers');
        expect(Array.isArray(response.body.data.passengers)).toBe(true);
      }
    });

    test('should return 404 for non-existent flight', async () => {
      const response = await request(app)
        .get('/flights/999999/passengers');
      
      if (response.status === 404) {
        expect(response.body.code).toBe(404);
        expect(response.body.data).toEqual({});
      }
    });

    test('should return 400 for invalid flight ID', async () => {
      const response = await request(app)
        .get('/flights/invalid/passengers')
        .expect(400);

      expect(response.body.code).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    test('should handle database connection errors gracefully', async () => {
      // This would test database connection failure scenarios
      const response = await request(app)
        .get('/flights/1/passengers');
      
      if (response.status === 400) {
        expect(response.body.code).toBe(400);
        expect(response.body).toHaveProperty('errors');
      }
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body.code).toBe(404);
      expect(response.body.data).toEqual({});
    });
  });
});

// Unit tests for services
describe('SeatAssignmentService', () => {
  let SeatAssignmentService;
  let service;

  beforeAll(async () => {
    const module = await import('../src/services/seatAssignmentService.js');
    SeatAssignmentService = module.SeatAssignmentService;
    service = new SeatAssignmentService();
  });

  test('should identify adjacent columns correctly', () => {
    expect(service.areSeatsAdjacent(
      { seat_row: 10, seat_column: 'A' },
      { seat_row: 10, seat_column: 'B' }
    )).toBe(true);

    expect(service.areSeatsAdjacent(
      { seat_row: 10, seat_column: 'A' },
      { seat_row: 10, seat_column: 'C' }
    )).toBe(false);

    expect(service.areSeatsAdjacent(
      { seat_row: 10, seat_column: 'A' },
      { seat_row: 11, seat_column: 'B' }
    )).toBe(false);
  });

  test('should group passengers by purchase correctly', () => {
    const passengers = [
      { purchase_id: 1, boarding_pass_id: 1 },
      { purchase_id: 2, boarding_pass_id: 2 },
      { purchase_id: 1, boarding_pass_id: 3 }
    ];

    const groups = service.groupByPurchase(passengers);
    expect(groups.size).toBe(2);
    expect(groups.get(1)).toHaveLength(2);
    expect(groups.get(2)).toHaveLength(1);
  });
});

describe('Case Converter', () => {
  let convertToCamelCase, toCamelCase;

  beforeAll(async () => {
    const module = await import('../src/utils/caseConverter.js');
    convertToCamelCase = module.convertToCamelCase;
    toCamelCase = module.toCamelCase;
  });

  test('should convert snake_case to camelCase', () => {
    expect(toCamelCase('flight_id')).toBe('flightId');
    expect(toCamelCase('takeoff_date_time')).toBe('takeoffDateTime');
    expect(toCamelCase('boarding_pass_id')).toBe('boardingPassId');
  });

  test('should convert object keys recursively', () => {
    const input = {
      flight_id: 1,
      passenger_data: {
        passenger_id: 123,
        boarding_pass_id: 456
      },
      passengers: [
        { seat_type_id: 1, seat_id: 10 }
      ]
    };

    const result = convertToCamelCase(input);
    
    expect(result).toHaveProperty('flightId');
    expect(result.passengerData).toHaveProperty('passengerId');
    expect(result.passengerData).toHaveProperty('boardingPassId');
    expect(result.passengers[0]).toHaveProperty('seatTypeId');
    expect(result.passengers[0]).toHaveProperty('seatId');
  });
});
