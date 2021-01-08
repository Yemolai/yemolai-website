import styled from 'styled-components'

const possibleJustifyContentOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    text-align: ${props => (Object.keys(props)
        .find((k) => /^text-(left|center|right)/i)
        || 'text-left')
        .replace(/^text-/, '')
    };
    justify-content: ${
        props => {
            const propsKeys = Object.keys(props)
            const justifyOption = propsKeys.find(k => /^justify-/i.test(k)) || 'justify-start'
            const option =justifyOption.replace(/^justify-/, '')
            return possibleJustifyContentOptions.includes(option) ? option : 'flex-start'
        }
    };
`
