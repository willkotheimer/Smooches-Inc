import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import CreateServicePage from './CreateServicePage';
import PageLayout from '../ui/PageLayout';
import PageTitle from '../ui/PageTitle';
import { useAppContext } from '../context/AppContext';

export default function CreateService() {
  const { user } = useAppContext();
  return (
    <PageLayout>
      <PageTitle>Create Service</PageTitle>
      {user ? <CreateServicePage /> : user === null ? <Loader /> : <Auth />}
    </PageLayout>
  );
}
