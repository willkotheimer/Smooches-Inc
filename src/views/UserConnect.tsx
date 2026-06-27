import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import LinkAccountsPage from './LinkAccountsPage';
import PageLayout from '../ui/PageLayout';
import PageTitle from '../ui/PageTitle';
import { useAppContext } from '../context/AppContext';

export default function UserConnect() {
  const { user } = useAppContext();
  return (
    <PageLayout>
      <PageTitle>Connect</PageTitle>
      {user ? <LinkAccountsPage /> : user === null ? <Loader /> : <Auth />}
    </PageLayout>
  );
}
