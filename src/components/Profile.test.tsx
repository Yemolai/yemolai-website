import React from 'react';
import { render, screen } from '@testing-library/react';
import { Profile } from './Profile'

describe('Profile', () => {
  it('renders Avatar image', async () => {
    render(<Profile username="yemolai" />)
    const textElement = await screen.findByText('Romulo Gabriel Rodrigues')
    expect(textElement).toBeDefined()
    expect(textElement).toBeInTheDocument()
  })
})
