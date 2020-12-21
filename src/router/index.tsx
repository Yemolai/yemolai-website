import React from 'react'
// @ts-ignore
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/Main.layout'
import { HomePage } from '../pages/Home.page'
import { AboutPage } from '../pages/About.page'

export function AppRouter() {
    return (
        <MainLayout>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/about">
                        <AboutPage />
                    </Route>
                </Switch>
            </Router>
        </MainLayout>
    )
}
