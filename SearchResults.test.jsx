import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from '../pages/SearchResults';
import { BookingProvider } from '../context/BookingContext';

test('SearchResults renders available flights and sort controls', async () => {
  render(
    <MemoryRouter>
      <BookingProvider>
        <SearchResults />
      </BookingProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText(/NQZ/i)).toBeInTheDocument();
  expect(screen.getByText(/Edit search/i)).toBeInTheDocument();
  expect(screen.getByText(/Sort by/i)).toBeInTheDocument();
  expect(screen.getByText(/Prices are per adult/i)).toBeInTheDocument();
});

test('SearchResults allows changing sort option', async () => {
  render(
    <MemoryRouter>
      <BookingProvider>
        <SearchResults />
      </BookingProvider>
    </MemoryRouter>
  );

  const select = screen.getByDisplayValue('Best');

  fireEvent.change(select, {
    target: { value: 'cheapest' }
  });

  expect(select.value).toBe('cheapest');
});