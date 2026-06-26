import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import LinkAccountsPage from './LinkAccountsPage';
import { useAppContext } from '../context/AppContext';

export default function UserConnect() {
  const { user } = useAppContext();
  return (
    <div>
      <h3 className="title d-flex justify-content-center">Connect with a user</h3>
      <br />
      {user ? <LinkAccountsPage /> : user === null ? <Loader /> : <Auth />}
    </div>
  );
}
