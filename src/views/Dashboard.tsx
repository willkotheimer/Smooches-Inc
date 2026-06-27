import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import DashboardView from './DashboardView';
import PageLayout from '../ui/PageLayout';
import PageTitle from '../ui/PageTitle';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { user } = useAppContext();
  return (
    <PageLayout>
      <PageTitle>Dashboard</PageTitle>
      {user ? <DashboardView /> : user === null ? <Loader /> : <Auth />}
    </PageLayout>
  );
}
