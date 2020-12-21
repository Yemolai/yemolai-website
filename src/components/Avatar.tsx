import React from 'react'

export type AvatarProps = {
    src: string
    alt?: string
    x: number
    y: number,
    unit?: string
}

export function Avatar ({ src, alt, x, y, unit = 'em' }: AvatarProps) {
    const width = `${x}${unit}`
    const height = `${y}${unit}`
    return (<div>
        <img src={src} alt={alt} style={{ width, height }}/>
    </div>)
}
