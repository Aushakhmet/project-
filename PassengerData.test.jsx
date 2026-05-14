import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PassengerData from '../pages/PassengerData';

const mockNavigate = jest.fn();
const mockSetPassengers = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    searchParams: {
      passengers: 1,
    },
    selectedSeats: ['1A'],
    setPassengers: mockSetPassengers,
  }),
}));

const mockUpsert = jest.fn();

jest.mock('../services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: null,
              error: null,
            })
          ),
        })),
      })),
      upsert: mockUpsert,
    })),
  },
}));

describe('PassengerData', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
      })
    );

    mockUpsert.mockResolvedValue({
      data: null,
      error: null,
    });

    window.scrollTo = jest.fn();
    window.alert = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders passenger data form', () => {
    render(
      <MemoryRouter>
        <PassengerData />
      </MemoryRouter>
    );

    expect(screen.getByText(/Passenger details/i)).toBeInTheDocument();
    expect(screen.getByText(/Passenger 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Passport Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByText(/Nationality/i)).toBeInTheDocument();
  });

  test('shows alert when required fields are empty', () => {
    render(
      <MemoryRouter>
        <PassengerData />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Continue to Payment/i }));

    expect(window.alert).toHaveBeenCalledWith(
      'Please fill in the required fields for Passenger 1.'
    );
  });

  test('saves passenger data and navigates to payment', async () => {
    render(
      <MemoryRouter>
        <PassengerData />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), {
      target: { value: 'Aushakhmet User' },
    });

    fireEvent.change(screen.getByPlaceholderText(/AB1234567/i), {
      target: { value: 'N77777777' },
    });

    fireEvent.change(screen.getByDisplayValue('Kazakhstan'), {
      target: { value: 'Kazakhstan' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue to Payment/i }));

    await waitFor(() => {
      expect(mockSetPassengers).toHaveBeenCalledWith([
        {
          full_name: 'Aushakhmet User',
          passport_number: 'N77777777',
          date_of_birth: '',
          nationality: 'Kazakhstan',
        },
      ]);
    });

    expect(mockUpsert).toHaveBeenCalledWith(
      {
        user_email: 'test@example.com',
        full_name: 'Aushakhmet User',
        passport_number: 'N77777777',
        date_of_birth: '',
        nationality: 'Kazakhstan',
      },
      { onConflict: 'user_email' }
    );

    expect(mockNavigate).toHaveBeenCalledWith('/payment');
  });
});