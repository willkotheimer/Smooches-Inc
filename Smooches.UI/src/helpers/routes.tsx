import { Switch, Route } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import RequestService from '../views/RequestService';
import CreateService from '../views/CreateService';
import LeaveReview from '../views/LeaveReview';
import UserConnect from '../views/UserConnect';
import NotFound from '../views/NotFound';
import ServiceForm from '../Components/Forms/ServiceForm';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/request-service" component={RequestService} />
      <Route exact path="/create-service" component={CreateService} />
      <Route exact path="/leave-review" component={LeaveReview} />
      <Route exact path="/user-connect" component={UserConnect} />
      <Route exact path="/service-form" render={() => <ServiceForm />} />
      <Route component={NotFound} />
    </Switch>
  );
}
