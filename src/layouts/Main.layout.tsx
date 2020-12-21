import React, { ReactNode, ReactNodeArray } from 'react'

export type MainLayoutProps = {
    children?: ReactNode | ReactNodeArray;
}

export function MainLayout ({ children = [] }: MainLayoutProps) {
    return (
        <div className="layout main-layout">
            Main layout
            <div className="layout-children main-layout-children">
                {children}
            </div>
        </div>
    )
}
