import { render, screen, fireEvent } from '@testing-library/react';
import { BookingProvider, useBooking } from '../context/BookingContext';

function TestComponent() {
  const {
    searchParams,
    setSearchParams,
    selectedFlight,
    setSelectedFlight,
    selectedSeats,
    setSelectedSeats,
    passengers,
    setPassengers
  } = useBooking();

  return (
    <div>
      <p data-testid="search">{searchParams?.origin || 'no-search'}</p>
      <p data-testid="flight">{selectedFlight?.id || 'no-flight'}</p>
      <p data-testid="seats">{selectedSeats.join(',') || 'no-seats'}</p>
      <p data-testid="passenger">{passengers[0]?.full_name || 'no-passenger'}</p>

      <button onClick={() => setSearchParams({ origin: 'NQZ', destination: 'ALA' })}>
        Set Search
      </button>

      <button onClick={() => setSelectedFlight({ id: 'AA777', airline: 'Air Astana' })}>
        Set Flight
      </button>

      <button onClick={() => setSelectedSeats(['1A'])}>
        Set Seat
      </button>

      <button onClick={() => setPassengers([{ full_name: 'Test Passenger' }])}>
        Set Passenger
      </button>
    </div>
  );
}

describe('BookingContext', () => {
  test('stores booking flow data', () => {
    render(
      <BookingProvider>
        <TestComponent />
      </BookingProvider>
    );

    expect(screen.getByTestId('search')).toHaveTextContent('no-search');
    expect(screen.getByTestId('flight')).toHaveTextContent('no-flight');
    expect(screen.getByTestId('seats')).toHaveTextContent('no-seats');
    expect(screen.getByTestId('passenger')).toHaveTextContent('no-passenger');

    fireEvent.click(screen.getByText('Set Search'));
    fireEvent.click(screen.getByText('Set Flight'));
    fireEvent.click(screen.getByText('Set Seat'));
    fireEvent.click(screen.getByText('Set Passenger'));

    expect(screen.getByTestId('search')).toHaveTextContent('NQZ');
    expect(screen.getByTestId('flight')).toHaveTextContent('AA777');
    expect(screen.getByTestId('seats')).toHaveTextContent('1A');
    expect(screen.getByTestId('passenger')).toHaveTextContent('Test Passenger');
  });
});