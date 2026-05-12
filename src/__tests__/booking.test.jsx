import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CustomerDashboard from '../pages/dashboards/CustomerDashboard';
import { BrowserRouter } from 'react-router-dom';

const mockUser = { email: 'test@example.com' };
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    role: 'Customer',
    loading: false
  })
}));

// Mock ServiceNow API
vi.mock('../lib/servicenow', () => ({
  servicenowAPI: {
    get: vi.fn().mockImplementation((url) => {
      if (url === '/x_1939650_smart_0_room') {
        return Promise.resolve({ data: { result: [{ sys_id: '1', room_number: '101', room_type: 'Deluxe', price_per_night: '5000', status: 'Available' }] } });
      }
      return Promise.resolve({ data: { result: [] } });
    }),
    post: vi.fn().mockResolvedValue({ data: { result: {} } }),
    patch: vi.fn().mockResolvedValue({ data: { result: {} } }),
  }
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('CustomerDashboard', () => {
  it('renders the booking section title', async () => {
    render(
      <BrowserRouter>
        <CustomerDashboard view="/book-room" />
      </BrowserRouter>
    );
    // Use findByText to wait for the loading state to finish
    expect(await screen.findByText(/Book Your Paradise/i)).toBeInTheDocument();
  });

  it('renders the room selection label', async () => {
    render(
      <BrowserRouter>
        <CustomerDashboard view="/book-room" />
      </BrowserRouter>
    );
    // Trigger the modal if needed, but in /book-room view, some text should be visible after load
    expect(await screen.findByText(/Room/i)).toBeInTheDocument();
  });
});
