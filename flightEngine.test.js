import { generateFlights, generateSeats } from '../services/flightEngine';

describe('flightEngine', () => {
  test('generateFlights returns an array of flights', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThanOrEqual(3);
    expect(flights.length).toBeLessThanOrEqual(6);
  });

  test('each generated flight contains required fields', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');
    const flight = flights[0];

    expect(flight).toHaveProperty('id');
    expect(flight).toHaveProperty('airline');
    expect(flight).toHaveProperty('origin');
    expect(flight).toHaveProperty('destination');
    expect(flight).toHaveProperty('departTime');
    expect(flight).toHaveProperty('arriveTime');
    expect(flight).toHaveProperty('duration');
    expect(flight).toHaveProperty('price');
    expect(flight).toHaveProperty('capacity');
    expect(flight).toHaveProperty('availableSeats');
  });

  test('generated flights are sorted by price', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    for (let i = 1; i < flights.length; i++) {
      expect(flights[i].price).toBeGreaterThanOrEqual(flights[i - 1].price);
    }
  });

  test('generateSeats returns correct number of seats', () => {
    const seats = generateSeats(75);

    expect(seats.length).toBe(75);
  });

  test('generated seats contain required fields', () => {
    const seats = generateSeats(10);
    const seat = seats[0];

    expect(seat).toHaveProperty('id');
    expect(seat).toHaveProperty('row');
    expect(seat).toHaveProperty('col');
    expect(seat).toHaveProperty('isOccupied');
  });

  test('seat id has correct format', () => {
    const seats = generateSeats(6);

    expect(seats[0].id).toBe('1A');
    expect(seats[1].id).toBe('1B');
    expect(seats[5].id).toBe('1F');
  });
});