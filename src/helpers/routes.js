import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import RequestService from '../views/RequestService';
import CreateService from '../views/CreateService';
import LeaveReview from '../views/LeaveReview';
import NotFound from '../views/NotFound';

export default function Routes({ user }) {
  return (
    <Switch>
      <Route exact path="/" component={() => <Dashboard user={user} />} />
      <PrivateRoute
        exact
        path="/request-service"
        component={RequestService} user={user} />}
      />
      <PrivateRoute exact path="/create-service" component={CreateService} user={user} />

      <PrivateRoute exact path="/leave-review" component={LeaveReview} user={user} />

      <Route component={NotFound} />
    </Switch>
  );
}

const PrivateRoute = ({ component: Component, user, ...rest }) => {
  const routeChecker = taco =>
    user ? (
      <Component {...taco} user={user} />
    ) : (
        <Redirect to={{ pathname: '/', state: { from: taco.location } }} />
      );

  return <Route {...rest} render={props => routeChecker(props)} />;
};
