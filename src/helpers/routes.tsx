import React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import firebase from 'firebase/app';
import Dashboard from '../views/Dashboard';
import RequestService from '../views/RequestService';
import CreateService from '../views/CreateService';
import LeaveReview from '../views/LeaveReview';
import UserConnect from '../views/UserConnect';
import NotFound from '../views/NotFound';
import ServiceForm from '../components/Forms/ServiceForm';

export interface RoutesProps {
  user: firebase.User | false | null;
  // Legacy shapes carried through from the data layer; tightened in later phases.
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
  joinedUserName?: string;
}

export default function Routes({
  user,
  otherName,
  otherKey,
  userKey,
  joinedUser,
  joinedUserName,
}: RoutesProps) {
  return (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <Dashboard
            joinedUser={joinedUser}
            joinedUserName={joinedUserName}
            otherKey={otherKey}
            otherName={otherName}
            userKey={userKey}
            user={user}
          />
        )}
      />

      <Route
        exact
        path="/request-service"
        render={() => (
          <RequestService
            joinedUser={joinedUser}
            otherKey={otherKey}
            otherName={otherName}
            userKey={userKey}
            user={user}
          />
        )}
      />

      <Route
        exact
        path="/create-service"
        render={() => (
          <CreateService
            otherName={otherName}
            joinedUser={joinedUser}
            user={user}
            otherKey={otherKey}
          />
        )}
      />

      <Route
        exact
        path="/leave-review"
        render={() => (
          <LeaveReview
            joinedUser={joinedUser}
            joinedUserName={joinedUserName}
            otherKey={otherKey}
            otherName={otherName}
            userKey={userKey}
            user={user}
          />
        )}
      />

      <Route
        exact
        path="/user-connect"
        render={() => (
          <UserConnect
            joinedUser={joinedUser}
            otherKey={otherKey}
            otherName={otherName}
            userKey={userKey}
            user={user}
          />
        )}
      />

      <PrivateRoute
        path="/user-connect"
        user={user}
        render={(props: RouteComponentProps) => <UserConnect {...(props as any)} />}
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

interface PrivateRouteProps {
  component?: React.ComponentType<any>;
  user: firebase.User | false | null;
  [key: string]: any;
}

const PrivateRoute = ({ component: Component, user, ...rest }: PrivateRouteProps) => {
  const routeChecker = (taco: RouteComponentProps) =>
    user && Component ? (
      <Component {...taco} user={user} />
    ) : (
      <Redirect to={{ pathname: '/', state: { from: taco.location } }} />
    );

  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
