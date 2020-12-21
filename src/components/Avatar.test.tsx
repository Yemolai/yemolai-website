import React from 'react';
import { render, screen } from '@testing-library/react';
import logo from '../logo.svg'
import { Avatar } from './Avatar'

describe('Avatar component', () => {
    it('renders image', async () => {
        const alt = 'test-image'
        render(<Avatar alt={alt} src={logo} x={32} y={32}/>)
        const element = await screen.findByAltText(new RegExp(alt))
        expect(element).toBeDefined()
        expect(element).toBeInTheDocument()
    });
})
