import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import RequestServicePage from './RequestServicePage';
import PageLayout from '../ui/PageLayout';
import PageTitle from '../ui/PageTitle';
import { useAppContext } from '../context/AppContext';

export default function RequestService() {
  const { user } = useAppContext();
  return (
    <PageLayout>
      <PageTitle>Request Service</PageTitle>
      {user ? <RequestServicePage /> : user === null ? <Loader /> : <Auth />}
    </PageLayout>
  );
}
