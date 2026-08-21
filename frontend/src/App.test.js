import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the duplicatas management page', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /gerenciamento de duplicatas/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/número da duplicata/i)).toBeInTheDocument();
});
