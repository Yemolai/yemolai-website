import React from 'react'
import styled from 'styled-components'

const RoundedImage = styled.img`
    border-radius: 0.2em;
    border: none;
`

export type AvatarProps = {
    src: string
    alt?: string
    x: number
    y: number,
    style?: object,
    unit?: string
}

export function Avatar ({ src, alt, x, y, style = {}, unit = 'em' }: AvatarProps) {
    const width = `${x}${unit}`
    const height = `${y}${unit}`
    return (<RoundedImage src={src} alt={alt} style={{ width, height, ...style }}/>)
}
