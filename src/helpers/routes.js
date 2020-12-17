import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import RequestService from '../views/RequestService';
import CreateService from '../views/CreateService';
import LeaveReview from '../views/LeaveReview';
import UserConnect from '../views/UserConnect';
import NotFound from '../views/NotFound';
import ServiceForm from '../components/Forms/ServiceForm';

export default function Routes({ user, otherName, otherKey, userKey, joinedUser }) {
  return (
    <Switch>
      <Route exact path="/" component={() => <Dashboard otherName={otherName} otherKey={otherKey} userKey={userKey} joinedUser={joinedUser} user={user} />} />
      
  <Route exact path="/request-service" render={() => <RequestService joinedUser={joinedUser}  otherKey={otherKey} otherName={otherName} userKey={userKey} user={user} /> } />
        
      <PrivateRoute exact path="/create-service" component={CreateService} otherName={otherName} joinedUser={joinedUser} user={user} />

      <Route exact path="/leave-review" render={() => <LeaveReview joinedUser={joinedUser}  otherKey={otherKey} otherName={otherName} userKey={userKey} user={user} /> } />

  <Route exact path="/user-connect" render={() => <UserConnect joinedUser={joinedUser}  otherKey={otherKey} otherName={otherName} userKey={userKey} user={user} /> } />

      <PrivateRoute
  path='/user-connect'
  render={(props) => (
    <UserConnect {...props} />
  )}
/>

      <Route
        exact
        path="/service-form"
        component={() => <ServiceForm user={user} />}
      />

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
