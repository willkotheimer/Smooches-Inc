import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import DashboardView from './DashboardView';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { user } = useAppContext();
  return (
    <div>
      <h3 className="title d-flex justify-content-center">Dashboard</h3>
      <br />
      {user ? <DashboardView /> : user === null ? <Loader /> : <Auth />}
    </div>
  );
}
