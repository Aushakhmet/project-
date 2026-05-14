import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Payment from '../pages/Payment';

const mockNavigate = jest.fn();

const mockBookingData = {
  selectedFlight: {
    id: 'AA777',
    airline: 'Air Astana',
    origin: 'NQZ',
    destination: 'ALA',
    departTime: '2026-06-15T08:30:00.000Z',
    arriveTime: '2026-06-15T10:00:00.000Z',
    price: 35000,
    travelClass: 'Economy',
  },
  selectedSeats: ['1A'],
  passengers: [
    {
      full_name: 'Aushakhmet User',
      passport_number: 'N77777777',
      date_of_birth: '2000-12-21',
      nationality: 'Kazakhstan',
    },
  ],
};

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('../context/BookingContext', () => ({
  useBooking: () => mockBookingData,
}));

const mockInsert = jest.fn();

jest.mock('../services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

describe('Payment', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
      })
    );

    mockInsert.mockResolvedValue({
      data: null,
      error: null,
    });

    window.scrollTo = jest.fn();
    window.alert = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders payment page with summary', () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    expect(screen.getByText(/Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/NQZ → ALA/i)).toBeInTheDocument();
    expect(screen.getByText(/Ticket \(1x\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure 256-bit SSL encryption/i)).toBeInTheDocument();
  });

  test('shows alert when card data is invalid', () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Pay/i }));

    expect(window.alert).toHaveBeenCalledWith('Please enter valid card details.');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  test('formats card number and saves booking after successful payment', async () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/0000 0000 0000 0000/i), {
      target: { value: '4111111111111111' },
    });

    fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), {
      target: { value: '1228' },
    });

    fireEvent.change(screen.getByPlaceholderText('•••'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Pay/i }));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([
        {
          user_id: null,
          user_email: 'test@example.com',
          flight_id: 'AA777',
          airline: 'Air Astana',
          origin: 'NQZ',
          destination: 'ALA',
          depart_time: '2026-06-15T08:30:00.000Z',
          arrive_time: '2026-06-15T10:00:00.000Z',
          price: 35000,
          seat: '1A',
          travel_class: 'Economy',
          passenger_name: 'Aushakhmet',
          passenger_surname: 'User',
        },
      ]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/confirmation');
  });
});