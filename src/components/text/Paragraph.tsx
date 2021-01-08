import styled from 'styled-components'

export const Paragraph = styled.p`
    font-size: 0.45cm;
    line-height: 110%;
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    text-align: ${props => (Object.keys(props)
        .find((k) => /^text-(left|center|right)/i)
        || 'text-left')
        .replace(/^text-/, '')
    };
`
