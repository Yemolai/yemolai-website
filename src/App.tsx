import React from 'react'
import styled from 'styled-components'
import { AppRouter } from './router'

export default styled(() => (<div><AppRouter/></div>))`
  margin: 0;
  font-family: 'Playfair Display', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--white-color, #EEEEEE);
`

