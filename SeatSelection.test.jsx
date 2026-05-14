import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeatSelection from '../pages/SeatSelection';
import { BookingProvider } from '../context/BookingContext';

describe('SeatSelection', () => {
  test('renders seat selection page', async () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <SeatSelection />
        </BookingProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Choose your seat/i)).toBeInTheDocument();
    expect(screen.getByText(/Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected/i)).toBeInTheDocument();
    expect(screen.getByText(/Occupied/i)).toBeInTheDocument();
  });

  test('continue button is disabled before seat selection', () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <SeatSelection />
        </BookingProvider>
      </MemoryRouter>
    );

    const continueButton = screen.getByRole('button', {
      name: /Continue/i,
    });

    expect(continueButton).toBeDisabled();
  });

  test('allows selecting available seat', async () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <SeatSelection />
        </BookingProvider>
      </MemoryRouter>
    );

    const seatButtons = screen.getAllByRole('button').filter((button) => {
      return /^\d+[A-F]$/.test(button.textContent);
    });

    const availableSeat = seatButtons.find((button) => !button.disabled);

    expect(availableSeat).toBeTruthy();

    fireEvent.click(availableSeat);

    expect(screen.getByRole('button', {
      name: /Continue/i,
    })).not.toBeDisabled();
  });
});