import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Login from '../views/login/Login'
import NewsSanBox from '../views/sandbox/NewsSanBox'

export default function IndexRouter() {
    return (
        <Router>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/' render={() =>
                    localStorage.getItem("token") ?
                        <NewsSanBox /> : <Redirect to="/login" />
                } />
            </Switch>
        </Router>
    )
}
