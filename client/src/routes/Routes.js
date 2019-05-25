import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Main from '../components/Main'
import ErrorComponent from '../components/ErrorComponent'
import Home from '../components/Home';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Main}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/404" component={ErrorComponent} />
      <Route component={ErrorComponent} />
    </Switch>
  </Router>
)

export default Routes;