import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import RequestServicePage from './RequestServicePage';
import { useAppContext } from '../context/AppContext';

export default function RequestService() {
  const { user } = useAppContext();
  return (
    <div>
      <h3 className="title d-flex justify-content-center">Request Service</h3>
      <br />
      {user ? <RequestServicePage /> : user === null ? <Loader /> : <Auth />}
    </div>
  );
}
