import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders MainLayout text', () => {
  render(<App />)
  const titleElement = screen.getByText(/Main layout/i)
  expect(titleElement).toBeDefined()
  expect(titleElement).toBeInTheDocument()
})
})
